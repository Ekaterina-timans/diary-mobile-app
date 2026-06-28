import { Text, YStack } from 'tamagui'
import { format } from 'date-fns'

interface CalendarCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  onPress: () => void
}

export function CalendarCell({ date, isCurrentMonth, isToday, isSelected, onPress }: CalendarCellProps) {
  return (
    <YStack
      flex={1}
      height={42}
      alignItems="center"
      justifyContent="center"
      opacity={isCurrentMonth ? 1 : 0.35}
      onPress={onPress}
      backgroundColor={
        isSelected ? 'rgba(139,92,246,0.2)' : isToday ? 'rgba(139,92,246,0.1)' : 'transparent'
      }
      borderRadius={12}
    >
      <Text fontWeight={isToday ? '700' : '400'}>{format(date, 'd')}</Text>
    </YStack>
  )
}
