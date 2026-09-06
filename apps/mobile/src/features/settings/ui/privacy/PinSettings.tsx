import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, useColorScheme } from 'react-native'
import { Text, YStack } from 'tamagui'

import { hasPin, removePin } from '@/src/shared/auth/pin'
import { Screen } from '@/src/shared/ui/Screen'
import { Button } from '@/src/shared/ui/button/Button'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { Header } from '@/src/shared/ui/navigation/Header'

export function PinSettings() {
  const isDark = useColorScheme() === 'dark'
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useFocusEffect(useCallback(() => {
    let active = true
    void hasPin().then((value) => {
      if (active) {
        setEnabled(value)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, []))

  function disablePin() {
    Alert.alert('Отключить PIN-код?', 'Сохранённый код будет удалён', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Отключить',
        style: 'destructive',
        onPress: async () => {
          try {
            await removePin()
            setEnabled(false)
          } catch {
            Alert.alert('Не удалось отключить PIN', 'Попробуйте ещё раз')
          }
        },
      },
    ])
  }

  return (
    <Screen>
      <Header title="PIN-код" />
      <YStack gap="$5" paddingTop="$3">
        <GlassCard variant={isDark ? 'dark' : 'light'}>
          <Text color="$text" fontSize="$6" fontWeight="700">
            {loading ? 'Проверяем настройку...' : enabled ? 'PIN-код включён' : 'PIN-код не настроен'}
          </Text>
          <Text color="$muted" fontSize="$4" lineHeight={21}>
            Четырёхзначный код можно использовать для разблокировки дневника вместо биометрии.
          </Text>
        </GlassCard>

        {!loading ? (
          <YStack gap="$3">
            <Button size="lg" onPress={() => router.push('/settings/privacy/pin-setup')}>
              {enabled ? 'Изменить PIN' : 'Создать PIN'}
            </Button>
            {enabled ? <Button variant="danger" onPress={disablePin}>Отключить PIN</Button> : null}
          </YStack>
        ) : null}
      </YStack>
    </Screen>
  )
}
