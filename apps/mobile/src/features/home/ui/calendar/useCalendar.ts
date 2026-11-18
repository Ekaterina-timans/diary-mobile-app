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

// Строит сетку календаря для выбранного месяца: добавляет дни соседних месяцев,
// чтобы календарь всегда начинался с понедельника и заканчивался воскресеньем.
export function useCalendar(currentMonth: Date) {
  return useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)

    // Границы полной сетки, а не только первого и последнего дня текущего месяца.
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const days: CalendarDayItem[] = []
    let day = gridStart

    // Последовательно формируем объекты для ячеек календаря.
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
