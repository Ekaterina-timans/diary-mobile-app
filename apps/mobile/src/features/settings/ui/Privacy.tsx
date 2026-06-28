import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  useColorScheme,
} from 'react-native'
import { Text, useTheme, XStack, YStack } from 'tamagui'
import { changePassword } from '../model/profile.api'
import {
  ChangePasswordFormValues,
  changePasswordFormSchema,
} from '../model/profile.schema'
import { Screen } from '@/src/shared/ui/Screen'
import { Button } from '@/src/shared/ui/button/Button'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { PasswordField } from '@/src/shared/ui/fields/PasswordField'
import { Header } from '@/src/shared/ui/navigation/Header'
import {
  authenticateWithBiometrics,
  getBiometricInfo,
} from '@/src/shared/auth/biometric'
import {
  getBiometricEnabled,
  setBiometricEnabled,
} from '@/src/shared/auth/biometricSettings'

const UPCOMING_PRIVACY_FEATURES = [
  { icon: 'hash' as const, title: 'Вход по PIN' },
  { icon: 'clock' as const, title: 'Автоблокировка приложения' },
  { icon: 'eye-off' as const, title: 'Скрытие в App Switcher' },
]

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return 'Не удалось изменить пароль. Попробуйте ещё раз'
  }

  const message = error.response?.data?.message

  if (Array.isArray(message)) {
    return message[0] ?? 'Не удалось изменить пароль'
  }

  return typeof message === 'string' ? message : 'Не удалось изменить пароль'
}

export function Privacy() {
  const theme = useTheme()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const [biometricName, setBiometricName] = useState<string | null>(null)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricEnabled, setBiometricEnabledState] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(true)
  const [biometricSaving, setBiometricSaving] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  useEffect(() => {
    let mounted = true

    async function loadBiometricSettings() {
      try {
        if (Platform.OS === 'web') {
          return
        }

        const [info, enabled] = await Promise.all([getBiometricInfo(), getBiometricEnabled()])

        if (!mounted) {
          return
        }

        setBiometricName(info.name)
        setBiometricAvailable(info.isAvailable)
        setBiometricEnabledState(enabled && info.isAvailable)
      } finally {
        if (mounted) {
          setBiometricLoading(false)
        }
      }
    }

    loadBiometricSettings()

    return () => {
      mounted = false
    }
  }, [])

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      reset()
      Alert.alert('Пароль изменён', 'Теперь для входа используйте новый пароль')
    } catch (error) {
      Alert.alert('Не удалось изменить пароль', getErrorMessage(error))
    }
  }

  async function handleBiometricToggle(nextValue: boolean) {
    if (biometricSaving) {
      return
    }

    try {
      setBiometricSaving(true)

      if (nextValue) {
        const result = await authenticateWithBiometrics()

        if (!result.success) {
          Alert.alert(
            'Не удалось включить биометрию',
            result.error ?? 'Проверьте настройки Face ID / Touch ID и попробуйте ещё раз',
          )
          return
        }

        await setBiometricEnabled(true)
        setBiometricEnabledState(true)
        Alert.alert('Биометрия включена', 'Теперь доступ к дневнику можно защищать биометрией')
        return
      }

      await setBiometricEnabled(false)
      setBiometricEnabledState(false)
      Alert.alert('Биометрия отключена', 'Доступ по биометрии больше не будет предлагаться')
    } catch (error) {
      Alert.alert(
        'Не удалось изменить настройку',
        error instanceof Error ? error.message : 'Попробуйте ещё раз',
      )
    } finally {
      setBiometricSaving(false)
    }
  }

  return (
    <Screen>
      <Header title="Конфиденциальность" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        >
          <YStack gap="$5">
            <GlassCard variant={isDark ? 'dark' : 'light'}>
              <XStack alignItems="center" gap="$4">
                <YStack
                  width={52}
                  height={52}
                  borderRadius={18}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$surfaceGlass"
                  borderWidth={1}
                  borderColor="$border"
                >
                  <Feather name="shield" size={25} color={theme.primary?.val} />
                </YStack>

                <YStack flex={1} gap="$1">
                  <Text color="$text" fontSize="$6" fontWeight="700">
                    Защита дневника
                  </Text>
                  <Text color="$muted" fontSize="$4" lineHeight={20}>
                    Управляйте паролем и способами доступа к личным записям
                  </Text>
                </YStack>
              </XStack>
            </GlassCard>

            <GlassCard variant={isDark ? 'dark' : 'light'}>
              <XStack alignItems="center" justifyContent="space-between" gap="$4">
                <YStack flex={1} gap="$1">
                  <Text color="$text" fontSize="$6" fontWeight="700">
                    Биометрия
                  </Text>
                  <Text color="$muted" fontSize="$4" lineHeight={20}>
                    {biometricLoading
                      ? 'Проверяем доступность Face ID / Touch ID...'
                      : biometricAvailable
                        ? `${biometricName ?? 'Биометрия'} можно использовать для защиты доступа`
                        : 'На этом устройстве биометрия недоступна или не настроена'}
                  </Text>
                </YStack>

                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  disabled={biometricLoading || biometricSaving || !biometricAvailable}
                  trackColor={{
                    false: theme.border?.val ?? '#D4D4D8',
                    true: theme.primary?.val ?? '#6B5BFF',
                  }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={theme.border?.val ?? '#D4D4D8'}
                />
              </XStack>

              {!biometricLoading && !biometricAvailable ? (
                <Text color="$muted" fontSize="$3" lineHeight={18}>
                  Чтобы включить эту защиту, настройте Face ID / Touch ID или отпечаток пальца
                  в системе.
                </Text>
              ) : null}
            </GlassCard>

            <GlassCard variant={isDark ? 'dark' : 'light'}>
              <YStack gap="$1">
                <Text color="$text" fontSize="$7" fontWeight="700">
                  Смена пароля
                </Text>
                <Text color="$muted" fontSize="$4" lineHeight={20}>
                  Новый пароль должен содержать не меньше 6 символов
                </Text>
              </YStack>

              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
                    label="Текущий пароль"
                    placeholder="Введите текущий пароль"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.currentPassword?.message}
                    autoComplete="current-password"
                  />
                )}
              />

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
                    label="Новый пароль"
                    placeholder="Придумайте новый пароль"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.newPassword?.message}
                    autoComplete="new-password"
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmNewPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordField
                    label="Повторите новый пароль"
                    placeholder="Введите новый пароль ещё раз"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmNewPassword?.message}
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />

              <Button size="lg" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? 'Сохраняем...' : 'Изменить пароль'}
              </Button>
            </GlassCard>

            <GlassCard variant={isDark ? 'dark' : 'light'}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text color="$text" fontSize="$6" fontWeight="700">
                  Скоро здесь
                </Text>
                <Text color="$primary" fontSize="$3" fontWeight="700">
                  В РАЗРАБОТКЕ
                </Text>
              </XStack>

              <YStack gap="$3">
                {UPCOMING_PRIVACY_FEATURES.map((item) => (
                  <XStack key={item.title} alignItems="center" gap="$3">
                    <YStack
                      width={36}
                      height={36}
                      borderRadius={12}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="$surfaceGlass"
                    >
                      <Feather name={item.icon} size={17} color={theme.muted?.val} />
                    </YStack>
                    <Text flex={1} color="$muted" fontSize="$4" fontWeight="500">
                      {item.title}
                    </Text>
                    <Feather name="lock" size={15} color={theme.muted?.val} />
                  </XStack>
                ))}
              </YStack>
            </GlassCard>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
