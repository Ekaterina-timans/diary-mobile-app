import { Text } from 'tamagui'
import { Screen } from '@/src/shared/ui/Screen'
import { Title } from '@/src/shared/ui/Title'

export default function HomeScreen() {
  return (
    <Screen>
      <Title>Home</Title>
      <Text opacity={0.7}>Calendar + pinned journals + pinned notes</Text>
    </Screen>
  )
}

