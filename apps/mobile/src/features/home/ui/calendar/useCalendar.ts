import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from 'date-fns'
import { useMemo } from 'react'

export interface CalendarDayItem {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

export function useCalendar(currentMonth: Date) {
  return useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)

    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // понедельник
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const days: CalendarDayItem[] = []
    let day = gridStart

    while (day <= gridEnd) {
      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, currentMonth),
        isToday: isToday(day),
      })

      day = addDays(day, 1)
    }

    return days
  }, [currentMonth])
}
