import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Alert, Platform, Switch, useColorScheme } from 'react-native'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import { authenticateWithBiometrics, getBiometricInfo } from '@/src/shared/auth/biometric'
import { getBiometricEnabled, setBiometricEnabled } from '@/src/shared/auth/biometricSettings'
import { Screen } from '@/src/shared/ui/Screen'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { Header } from '@/src/shared/ui/navigation/Header'

export function BiometricSettings() {
  const theme = useTheme()
  const isDark = useColorScheme() === 'dark'
  const [name, setName] = useState('Биометрия')
  const [available, setAvailable] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        if (Platform.OS === 'web') return
        const [info, savedEnabled] = await Promise.all([
          getBiometricInfo(),
          getBiometricEnabled(),
        ])
        if (!active) return
        setName(info.name ?? 'Биометрия')
        setAvailable(info.isAvailable)
        setEnabled(savedEnabled && info.isAvailable)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadSettings()
    return () => {
      active = false
    }
  }, [])

  async function handleToggle(nextValue: boolean) {
    if (saving) return
    try {
      setSaving(true)
      if (nextValue) {
        const result = await authenticateWithBiometrics()
        if (!result.success) {
          Alert.alert('Не удалось включить биометрию', result.error ?? 'Попробуйте ещё раз')
          return
        }
      }
      await setBiometricEnabled(nextValue)
      setEnabled(nextValue)
    } catch {
      Alert.alert('Не удалось изменить настройку', 'Попробуйте ещё раз')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen>
      <Header title={name} />
      <YStack gap="$5" paddingTop="$3">
        <GlassCard variant={isDark ? 'dark' : 'light'}>
          <YStack alignItems="center" gap="$3" paddingVertical="$3">
            <Feather name="shield" size={44} color={theme.primary?.val} />
            <Text color="$text" fontSize="$7" fontWeight="700" textAlign="center">
              Разблокировка без пароля
            </Text>
            <Text color="$muted" fontSize="$4" lineHeight={21} textAlign="center">
              Используйте {name}, чтобы быстро открыть дневник после запуска приложения
            </Text>
          </YStack>
        </GlassCard>

        <GlassCard variant={isDark ? 'dark' : 'light'}>
          <XStack alignItems="center" justifyContent="space-between" gap="$4">
            <YStack flex={1} gap="$1">
              <Text color="$text" fontSize="$5" fontWeight="600">Использовать {name}</Text>
              <Text color="$muted" fontSize="$3" lineHeight={18}>
                {available ? 'Запрашивать при входе в приложение' : 'Недоступно на этом устройстве'}
              </Text>
            </YStack>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              disabled={loading || saving || !available}
              trackColor={{ false: theme.border?.val, true: theme.primary?.val }}
              thumbColor="#FFFFFF"
            />
          </XStack>
        </GlassCard>
      </YStack>
    </Screen>
  )
}
