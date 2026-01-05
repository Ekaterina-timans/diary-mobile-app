import { Text } from 'tamagui'
import { Screen } from '@/src/shared/ui/Screen'
import { Title } from '@/src/shared/ui/Title'

export default function JournalScreen() {
  return (
    <Screen>
      <Title>Journal</Title>
      <Text opacity={0.7}>Books + page flip animation</Text>
    </Screen>
  )
}
