import { RichText, useEditorBridge } from '@10play/tentap-editor'
import { YStack } from 'tamagui'
import { createInitialEditorContent } from '../../model/createInitialEditorContent'
import type { JournalPage } from '../../model/journal.types'

type JournalPageEditorProps = {
  page: JournalPage
}

export function JournalPageEditor({ page }: JournalPageEditorProps) {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: createInitialEditorContent(page),
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
