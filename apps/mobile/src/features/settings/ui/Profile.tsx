import { useForm, Controller } from 'react-hook-form'
import { ProfileFormValues, profileSchema } from '../model/profile.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { Screen } from '@/src/shared/ui/Screen'
import { Text, XStack, YStack } from 'tamagui'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { TextField } from '@/src/shared/ui/fields/TextField'
import { Button } from '@/src/shared/ui/button/Button'
import { getProfile, updateProfile } from '../model/profile.api'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Header } from '@/src/shared/ui/navigation/Header'

export function Profile() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getProfile()
      setValue('displayName', data.displayName)
      setValue('email', data.email)
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить профиль')
    }
  }

  async function onSubmitProfile(values: ProfileFormValues) {
    try {
      await updateProfile(values)
      Alert.alert('Готово', 'Профиль обновлен')
    } catch (e: any) {
      Alert.alert('Ошибка', e.response?.data?.message ?? 'Ошибка')
    }
  }

  return (
    <Screen>
      <Header title="Профиль" />
      <YStack gap="$6" marginTop="$4">
        <GlassCard>
          <Text fontSize="$7" fontWeight="700">
            Основные данные
          </Text>

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Имя"
                value={value}
                onChangeText={onChange}
                error={errors.displayName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Button onPress={handleSubmit(onSubmitProfile)} disabled={isSubmitting}>
            Сохранить изменения
          </Button>
        </GlassCard>
      </YStack>
    </Screen>
  )
}
