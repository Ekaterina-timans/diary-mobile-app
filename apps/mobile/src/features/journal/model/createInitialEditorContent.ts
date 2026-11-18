import type { JournalPage } from './journal.types'

// Подготавливает документ для Tiptap при открытии страницы. Сначала использует
// сохранённый JSON с форматированием, а для старых страниц восстанавливает его из plain-текста.
export function createInitialEditorContent(page: JournalPage): Record<string, unknown> {
  if (page.contentJson) {
    return page.contentJson
  }

  // Для совершенно новой страницы создаём один пустой абзац, чтобы курсор был виден сразу.
  if (!page.contentPlain) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    }
  }

  // Разделяем прежний простой текст на абзацы, если JSON ещё не был создан.
  return {
    type: 'doc',
    content: page.contentPlain.split('\n').map((text) => ({
      type: 'paragraph',
      content: text ? [{ type: 'text', text }] : undefined,
    })),
  }
}
