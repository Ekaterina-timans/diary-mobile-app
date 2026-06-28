import { YStack, Text } from 'tamagui'
import { Screen } from '@/src/shared/ui/Screen'
import { Calendar } from '@/src/features/home/ui/calendar/Calendar'

export default function HomeScreen() {
  return (
    <Screen>
      <YStack gap="$5">
        <Calendar />

        <Text opacity={0.6}>Закреплённые журналы и заметки появятся ниже</Text>
      </YStack>
    </Screen>
  )
}
