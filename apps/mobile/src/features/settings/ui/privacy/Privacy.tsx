import { Feather } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { ComponentProps, useCallback, useState } from 'react'
import { Platform, Pressable, ScrollView, useColorScheme } from 'react-native'
import { Text, useTheme, XStack, YStack } from 'tamagui'

import { getBiometricInfo } from '@/src/shared/auth/biometric'
import { getBiometricEnabled } from '@/src/shared/auth/biometricSettings'
import { AutoLockOption, getAutoLockOption } from '@/src/shared/auth/autoLockSettings'
import { getAppSwitcherProtectionEnabled } from '@/src/shared/auth/appSwitcherSettings'
import { hasPin } from '@/src/shared/auth/pin'
import { Screen } from '@/src/shared/ui/Screen'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { Header } from '@/src/shared/ui/navigation/Header'

type FeatherName = ComponentProps<typeof Feather>['name']

const AUTO_LOCK_LABELS: Record<AutoLockOption, string> = {
  immediately: 'Сразу',
  '1_minute': '1 мин.',
  '5_minute': '5 мин.',
  '15_minute': '15 мин.',
  never: 'Никогда',
}

type PrivacyRowProps = {
  icon: FeatherName
  title: string
  subtitle: string
  status?: string
  disabled?: boolean
  onPress?: () => void
}

function PrivacyRow({
  icon,
  title,
  subtitle,
  status,
  disabled = false,
  onPress,
}: PrivacyRowProps) {
  const theme = useTheme()
  const isDark = useColorScheme() === 'dark'

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: disabled ? 0.55 : pressed ? 0.7 : 1,
      })}
    >
      <GlassCard variant={isDark ? 'dark' : 'light'}>
        <XStack alignItems="center" gap="$4">
          <YStack
            width={44}
            height={44}
            borderRadius={14}
            alignItems="center"
            justifyContent="center"
            backgroundColor="$surfaceGlass"
            borderWidth={1}
            borderColor="$border"
          >
            <Feather name={icon} size={21} color={theme.primary?.val} />
          </YStack>

          <YStack flex={1} gap="$1">
            <Text color="$text" fontSize="$5" fontWeight="600">
              {title}
            </Text>
            <Text color="$muted" fontSize="$3" lineHeight={18}>
              {subtitle}
            </Text>
          </YStack>

          {status ? (
            <Text color={disabled ? '$muted' : '$primary'} fontSize="$3" fontWeight="600">
              {status}
            </Text>
          ) : null}

          <Feather name={disabled ? 'lock' : 'chevron-right'} size={19} color={theme.muted?.val} />
        </XStack>
      </GlassCard>
    </Pressable>
  )
}

export function Privacy() {
  const theme = useTheme()
  const colorScheme = useColorScheme()
  const [pinEnabled, setPinEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabledState] = useState(false)
  const [biometricName, setBiometricName] = useState('Биометрия')
  const [autoLockOption, setAutoLockOptionState] = useState<AutoLockOption>('immediately')
  const [appSwitcherProtectionEnabled, setAppSwitcherProtectionEnabledState] = useState(false)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      let active = true

      async function loadProtectionState() {
        try {
          const [pinExists, savedAutoLockOption, appSwitcherEnabled] = await Promise.all([
            hasPin(),
            getAutoLockOption(),
            getAppSwitcherProtectionEnabled(),
          ])
          let biometricIsEnabled = false
          let name = 'Биометрия'

          if (Platform.OS !== 'web') {
            const [enabled, info] = await Promise.all([
              getBiometricEnabled(),
              getBiometricInfo(),
            ])
            biometricIsEnabled = enabled && info.isAvailable
            name = info.name ?? name
          }

          if (active) {
            setPinEnabled(pinExists)
            setBiometricEnabledState(biometricIsEnabled)
            setBiometricName(name)
            setAutoLockOptionState(savedAutoLockOption)
            setAppSwitcherProtectionEnabledState(appSwitcherEnabled)
          }
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }

      void loadProtectionState()

      return () => {
        active = false
      }
    }, []),
  )

  const variant = colorScheme === 'dark' ? 'dark' : 'light'

  return (
    <Screen>
      <Header title="Конфиденциальность" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
      >
        <YStack gap="$5">
          <YStack gap="$1" paddingHorizontal="$1">
            <Text color="$text" fontSize="$7" fontWeight="700">
              Защита дневника
            </Text>
            <Text color="$muted" fontSize="$4" lineHeight={20}>
              Выберите способ доступа и управляйте паролем аккаунта
            </Text>
          </YStack>

          <YStack gap="$3">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/settings/privacy/pin')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <GlassCard variant={variant}>
                <XStack alignItems="center" gap="$4">
                  <YStack
                    width={44}
                    height={44}
                    borderRadius={14}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$surfaceGlass"
                    borderWidth={1}
                    borderColor="$border"
                  >
                    <Feather name="hash" size={21} color={theme.primary?.val} />
                  </YStack>
                  <YStack flex={1} gap="$1">
                    <Text color="$text" fontSize="$5" fontWeight="600">PIN-код</Text>
                    <Text color="$muted" fontSize="$3">Четырёхзначный код доступа</Text>
                  </YStack>
                  <Text color="$primary" fontSize="$3" fontWeight="600">
                    {loading ? '...' : pinEnabled ? 'Включён' : 'Не настроен'}
                  </Text>
                  <Feather name="chevron-right" size={19} color={theme.muted?.val} />
                </XStack>
              </GlassCard>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/settings/privacy/biometric')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <GlassCard variant={variant}>
                <XStack alignItems="center" gap="$4">
                  <YStack
                    width={44}
                    height={44}
                    borderRadius={14}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$surfaceGlass"
                    borderWidth={1}
                    borderColor="$border"
                  >
                    <Feather name="shield" size={21} color={theme.primary?.val} />
                  </YStack>
                  <YStack flex={1} gap="$1">
                    <Text color="$text" fontSize="$5" fontWeight="600">{biometricName}</Text>
                    <Text color="$muted" fontSize="$3">Быстрая разблокировка</Text>
                  </YStack>
                  <Text color="$primary" fontSize="$3" fontWeight="600">
                    {loading ? '...' : biometricEnabled ? 'Включена' : 'Выключена'}
                  </Text>
                  <Feather name="chevron-right" size={19} color={theme.muted?.val} />
                </XStack>
              </GlassCard>
            </Pressable>

            <PrivacyRow
              icon="key"
              title="Изменить пароль"
              subtitle="Пароль от аккаунта"
              onPress={() => router.push('/settings/privacy/change-password')}
            />
          </YStack>

          <YStack gap="$3">
            <Text color="$muted" fontSize="$3" fontWeight="600" paddingHorizontal="$2">
              ДОПОЛНИТЕЛЬНО
            </Text>
            <PrivacyRow
              icon="clock"
              title="Автоблокировка"
              subtitle="Блокировка через выбранное время"
              status={loading ? '...' : AUTO_LOCK_LABELS[autoLockOption]}
              onPress={() => router.push('/settings/privacy/auto-lock')}
            />
            <PrivacyRow
              icon="eye-off"
              title="Скрытие в App Switcher"
              subtitle="Не показывать содержимое в превью"
              status={loading ? '...' : appSwitcherProtectionEnabled ? 'Включено' : 'Выключено'}
              onPress={() => router.push('/settings/privacy/app-switcher')}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </Screen>
  )
}
