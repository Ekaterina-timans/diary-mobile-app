import { Feather } from '@expo/vector-icons'
import { Text, YStack } from 'tamagui'
import { Card } from '@/src/shared/ui/cards/Card'

/*
* Показывается, когда у пользователя ещё нет ни папок, ни журналов. 
*/
export function EmptyJournalState() {
  return (
    <Card alignItems="center" gap="$3" paddingVertical="$6">
      <YStack
        alignItems="center"
        backgroundColor="#F1EEFF"
        borderRadius={24}
        height={56}
        justifyContent="center"
        width={56}
      >
        <Feather name="book-open" size={25} color="#4F46B5" />
      </YStack>

      <Text fontSize="$6" fontWeight="700" textAlign="center">
        Здесь появятся ваши истории
      </Text>
      <Text opacity={0.6} textAlign="center">
        Создайте первую папку или журнал, чтобы начать писать.
      </Text>
    </Card>
  )
}
