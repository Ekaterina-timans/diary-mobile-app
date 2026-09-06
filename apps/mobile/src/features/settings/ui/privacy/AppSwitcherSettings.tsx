import { getAppSwitcherProtectionEnabled, setAppSwitcherProtectionEnabled } from "@/src/shared/auth/appSwitcherSettings";
import { GlassCard } from "@/src/shared/ui/cards/GlassCard";
import { Header } from "@/src/shared/ui/navigation/Header";
import { Screen } from "@/src/shared/ui/Screen";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Platform, Switch, useColorScheme } from "react-native";
import { Text, useTheme, XStack, YStack } from "tamagui";

export function AppSwitcherSettings() {
  const theme = useTheme()
  const isDark = useColorScheme() === 'dark'

  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function loadSetting() {
      try {
        const savedValue = await getAppSwitcherProtectionEnabled()

        if (active) {
          setEnabled(savedValue)
        }
      } catch {
        if (active) {
          Alert.alert(
            'Не удалось загрузить настройку',
            'Попробуй ещё раз'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
    void loadSetting()
    return () => {
      active = false
    }
  }, [])

  async function handleToggle(nextValue: boolean) {
    if (saving) {
      return
    }

    try {
      setSaving(true)
      await setAppSwitcherProtectionEnabled(nextValue)
      setEnabled(nextValue)
    } catch {
      Alert.alert(
        'Не удалось изменить настройку',
        'Попробуйте ещё раз',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen>
      <Header title="Скрытие содержимого" />

      <YStack gap="$5" paddingTop="$3">
        <GlassCard variant={isDark ? 'dark' : 'light'}>
          <YStack
            alignItems="center"
            gap="$3"
            paddingVertical="$3"
          >
            <Feather
              name="eye-off"
              size={44}
              color={theme.primary?.val}
            />

            <Text
              color="$text"
              fontSize="$7"
              fontWeight="700"
              textAlign="center"
            >
              Защита в App Switcher
            </Text>

            <Text
              color="$muted"
              fontSize="$4"
              lineHeight={21}
              textAlign="center"
            >
              Скрывает содержимое дневника в окне
              переключения между приложениями
            </Text>
          </YStack>
        </GlassCard>

        <GlassCard variant={isDark ? 'dark' : 'light'}>
          <XStack
            alignItems="center"
            justifyContent="space-between"
            gap="$4"
          >
            <YStack flex={1} gap="$1">
              <Text
                color="$text"
                fontSize="$5"
                fontWeight="600"
              >
                Скрывать содержимое
              </Text>

              <Text
                color="$muted"
                fontSize="$3"
                lineHeight={18}
              >
                {Platform.OS === 'android'
                  ? 'На Android это также запретит скриншоты и запись экрана'
                  : 'Вместо содержимого будет показано размытие'}
              </Text>
            </YStack>

            <Switch
              value={enabled}
              onValueChange={handleToggle}
              disabled={loading || saving}
              trackColor={{
                false: theme.border?.val ?? '#D4D4D8',
                true: theme.primary?.val ?? '#7C3AED',
              }}
              thumbColor="#FFFFFF"
            />
          </XStack>
        </GlassCard>
      </YStack>
    </Screen>
  )
}