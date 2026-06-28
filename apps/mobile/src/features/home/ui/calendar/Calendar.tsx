import { useState } from 'react'
import { Text, YStack, XStack, Button } from 'tamagui'
import { addMonths, subMonths, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarGrid } from './CalendarGrid'
import { Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  return (
    <GlassCard>
      <YStack gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <Pressable
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.45)',
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Feather name="chevron-left" size={22} color="#7C3AED" />
          </Pressable>

          <Text fontSize="$6" fontWeight="600">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </Text>

          <Pressable
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.45)',
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Feather name="chevron-right" size={22} color="#7C3AED" />
          </Pressable>
        </XStack>

        <CalendarGrid month={currentMonth} />
      </YStack>
    </GlassCard>
  )
}
