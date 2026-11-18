import { EditorBridge } from '@10play/tentap-editor'
import { useCallback, useEffect, useRef } from 'react'
import { createInitialEditorContent } from '../../model/createInitialEditorContent'
import { JournalPage } from '../../model/journal.types'
import { saveJournalPageDraft } from '../../storage/journalPageDraft.repository'

type UseJournalPageDraftPersistenceProps = {
  editor: EditorBridge
  page: JournalPage
  userId: string
}

// Создаёт строковое представление содержимого для быстрого сравнения версий текста.
function createContentSignature(contentJson: Record<string, unknown>, contentPlain: string) {
  return JSON.stringify({ contentJson, contentPlain })
}

export function useJournalPageDraftPersistence({
  editor,
  page,
  userId,
}: UseJournalPageDraftPersistenceProps) {
  // Храним последнюю сохраненную версию, чтобы не записывать одинаковый текст
  const lastContentSignature = useRef(
    createContentSignature(createInitialEditorContent(page), page.contentPlain ?? ''),
  )

  // Выстраивает обращения к SQLite в очередь, чтобы синхронизация не прочитала
  // черновик до завершения предыдущей локальной записи
  const writePromiseRef = useRef<Promise<void>>(Promise.resolve())

  // Хранит таймер локального сохранения после паузы в наборе текста
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Ставит новую локальную версию в очередь и ждёт её завершения.
  // Это не даёт синхронизации прочитать SQLite между двумя записями.
  const saveContent = useCallback(
    async (nextContentJson: Record<string, unknown>, nextContentPlain: string) => {
      const contentSignature = createContentSignature(nextContentJson, nextContentPlain)

      if (lastContentSignature.current === contentSignature) {
        await writePromiseRef.current
        return
      }

      lastContentSignature.current = contentSignature

      writePromiseRef.current = writePromiseRef.current
        .catch(() => undefined)
        .then(() =>
          saveJournalPageDraft({
            userId,
            pageId: page.id,
            contentJson: nextContentJson,
            contentPlain: nextContentPlain,
            revision: page.revision,
            updatedAt: new Date().toISOString(),
            isDirty: true,
          }),
        )

      await writePromiseRef.current
    },
    [page.id, page.revision, userId],
  )

  // Забирает актуальное содержимое напрямую из готового редактора
  const saveCurrentDraft = useCallback(async () => {
    const editorState = editor.getEditorState()

    if (!editorState.isReady || !editor.webviewRef.current) return

    const [contentJson, contentPlain] = await Promise.all([editor.getJSON(), editor.getText()])

    await saveContent(contentJson as Record<string, unknown>, contentPlain)
  }, [editor, saveContent])

  // После окончания набора текста ждёт 300 мс и сохраняет черновик локально.
  // Таймер сбрасывается на каждый новый символ, поэтому запись не идёт на каждое нажатие.
  useEffect(() => {
    const unsubscribe = editor._subscribeToContentUpdate(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        void saveCurrentDraft().catch(() => undefined)
      }, 300)
    })

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      unsubscribe()
    }
  }, [editor, saveCurrentDraft])

  return { saveCurrentDraft }
}
