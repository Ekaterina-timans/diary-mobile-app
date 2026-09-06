import { useLocalSearchParams } from 'expo-router'
import { JournalReader } from '@/src/features/journal/ui/reader/JournalReader'
import { Screen } from '@/src/shared/ui/Screen'

export default function JournalReaderScreen() {
  const { journalId } = useLocalSearchParams<{ journalId: string }>()

  if (!journalId) {
    return null
  }

  return (
    <Screen>
      <JournalReader journalId={journalId} />
    </Screen>
  )
}
