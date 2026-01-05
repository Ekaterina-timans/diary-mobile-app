import { Text } from 'tamagui'
import { Screen } from '@/src/shared/ui/Screen'
import { Title } from '@/src/shared/ui/Title'

export default function NotesScreen() {
  return (
    <Screen>
      <Title>Notes</Title>
      <Text opacity={0.7}>Pinned notes + last opened</Text>
    </Screen>
  )
}
