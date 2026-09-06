import { useLocalSearchParams } from 'expo-router'
import { JournalPageReader } from '@/src/features/journal/ui/reader/JournalPageReader'
import { Screen } from '@/src/shared/ui/Screen'

export default function JournalPageScreen() {
  const { pageId } = useLocalSearchParams<{ pageId: string }>()

  if (!pageId) {
    return null
  }

  return (
    <Screen>
      <JournalPageReader pageId={pageId} />
    </Screen>
  )
}
