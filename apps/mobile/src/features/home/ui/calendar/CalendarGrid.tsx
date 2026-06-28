import { XStack, YStack } from 'tamagui'
import { useState } from 'react'
import { isSameDay } from 'date-fns'
import { useCalendar } from './useCalendar'
import { CalendarCell } from './CalendarCell'

export function CalendarGrid({ month }: { month: Date }) {
  const days = useCalendar(month)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <YStack gap="$1.5">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <XStack key={rowIndex} gap="$2">
          {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day) => (
            <CalendarCell
              key={day.date.toISOString()}
              date={day.date}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              isSelected={isSameDay(day.date, selectedDate)}
              onPress={() => setSelectedDate(day.date)}
            />
          ))}
        </XStack>
      ))}
    </YStack>
  )
}
