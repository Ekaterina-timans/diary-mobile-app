import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Alert, Pressable, useColorScheme } from 'react-native'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import {
  AutoLockOption,
  getAutoLockOption,
  setAutoLockOption,
} from '@/src/shared/auth/autoLockSettings'
import { Screen } from '@/src/shared/ui/Screen'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { Header } from '@/src/shared/ui/navigation/Header'

const AUTO_LOCK_OPTIONS: Array<{
  value: AutoLockOption
  title: string
  subtitle: string
}> = [
  {
    value: 'immediately',
    title: 'Сразу',
    subtitle: 'При каждом возвращении в приложение',
  },
  {
    value: '1_minute',
    title: 'Через 1 минуту',
    subtitle: 'Можно вернуться без повторного входа в течение минуты',
  },
  {
    value: '5_minute',
    title: 'Через 5 минут',
    subtitle: 'Блокировать после пяти минут в фоне',
  },
  {
    value: '15_minute',
    title: 'Через 15 минут',
    subtitle: 'Блокировать после пятнадцати минут в фоне',
  },
  {
    value: 'never',
    title: 'Никогда',
    subtitle: 'Не блокировать после сворачивания приложения',
  },
]

export function AutoLockSettings() {
  const theme = useTheme()
  const isDark = useColorScheme() === 'dark'
  const [selected, setSelected] = useState<AutoLockOption>('immediately')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function loadOption() {
      try {
        const option = await getAutoLockOption()
        if (active) setSelected(option)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadOption()
    return () => {
      active = false
    }
  }, [])

  async function selectOption(option: AutoLockOption) {
    if (saving || option === selected) return

    const previousOption = selected
    setSelected(option)
    setSaving(true)

    try {
      await setAutoLockOption(option)
    } catch {
      setSelected(previousOption)
      Alert.alert('Не удалось сохранить настройку', 'Попробуйте ещё раз')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen>
      <Header title="Автоблокировка" />

      <YStack gap="$4" paddingTop="$3">
        <Text color="$muted" fontSize="$4" lineHeight={21} paddingHorizontal="$1">
          Выберите, через какое время после сворачивания снова запрашивать PIN или биометрию.
        </Text>

        <YStack gap="$3" opacity={loading ? 0.55 : 1}>
          {AUTO_LOCK_OPTIONS.map((option) => {
            const isSelected = option.value === selected

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected, disabled: loading || saving }}
                disabled={loading || saving}
                onPress={() => void selectOption(option.value)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <GlassCard variant={isDark ? 'dark' : 'light'}>
                  <XStack alignItems="center" gap="$4">
                    <YStack flex={1} gap="$1">
                      <Text color="$text" fontSize="$5" fontWeight="600">
                        {option.title}
                      </Text>
                      <Text color="$muted" fontSize="$3" lineHeight={18}>
                        {option.subtitle}
                      </Text>
                    </YStack>

                    {isSelected ? (
                      <Feather name="check-circle" size={23} color={theme.primary?.val} />
                    ) : (
                      <YStack
                        width={23}
                        height={23}
                        borderRadius={12}
                        borderWidth={1}
                        borderColor="$border"
                      />
                    )}
                  </XStack>
                </GlassCard>
              </Pressable>
            )
          })}
        </YStack>
      </YStack>
    </Screen>
  )
}
