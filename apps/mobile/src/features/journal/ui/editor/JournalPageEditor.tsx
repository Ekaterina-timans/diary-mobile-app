import { RichText, useEditorBridge } from '@10play/tentap-editor'
import { YStack } from 'tamagui'
import { createInitialEditorContent } from '../../model/createInitialEditorContent'
import type { JournalPage } from '../../model/journal.types'
import { useSyncJournalPageDraftOnLeave } from '../reader/useSyncJournalPageDraftOnLeave'
import { useJournalPageDraftPersistence } from './useJournalPageDraftPersistence'

type JournalPageEditorProps = {
  page: JournalPage
  userId: string
}

export function JournalPageEditor({ page, userId }: JournalPageEditorProps) {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: createInitialEditorContent(page),
  })

  const { saveCurrentDraft } = useJournalPageDraftPersistence({
    editor,
    page,
    userId,
  })

  useSyncJournalPageDraftOnLeave({
    userId,
    pageId: page.id,
    saveCurrentDraft,
  })

  return (
    <YStack
      flex={1}
      backgroundColor="$backgroundStrong"
      borderColor="$border"
      borderRadius={20}
      borderWidth={1}
      overflow="hidden"
    >
      <RichText editor={editor} />
    </YStack>
  )
}
