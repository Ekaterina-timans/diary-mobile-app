import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, useColorScheme } from 'react-native'
import { Text, YStack } from 'tamagui'

import { changePassword } from '../../model/profile.api'
import { ChangePasswordFormValues, changePasswordFormSchema } from '../../model/profile.schema'
import { Screen } from '@/src/shared/ui/Screen'
import { Button } from '@/src/shared/ui/button/Button'
import { GlassCard } from '@/src/shared/ui/cards/GlassCard'
import { PasswordField } from '@/src/shared/ui/fields/PasswordField'
import { Header } from '@/src/shared/ui/navigation/Header'

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return 'Не удалось изменить пароль. Попробуйте ещё раз'
  const message = error.response?.data?.message
  if (Array.isArray(message)) return message[0] ?? 'Не удалось изменить пароль'
  return typeof message === 'string' ? message : 'Не удалось изменить пароль'
}

export function ChangePassword() {
  const isDark = useColorScheme() === 'dark'
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordFormSchema),
      defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    })

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      reset()
      Alert.alert('Пароль изменён', 'Теперь для входа используйте новый пароль')
    } catch (error) {
      Alert.alert('Не удалось изменить пароль', getErrorMessage(error))
    }
  }

  return (
    <Screen>
      <Header title="Изменить пароль" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <GlassCard variant={isDark ? 'dark' : 'light'}>
            <YStack gap="$1">
              <Text color="$text" fontSize="$6" fontWeight="700">Новый пароль</Text>
              <Text color="$muted" fontSize="$4">Используйте не меньше 6 символов</Text>
            </YStack>
            <Controller control={control} name="currentPassword" render={({ field }) => (
              <PasswordField label="Текущий пароль" placeholder="Введите текущий пароль" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={errors.currentPassword?.message} autoComplete="current-password" />
            )} />
            <Controller control={control} name="newPassword" render={({ field }) => (
              <PasswordField label="Новый пароль" placeholder="Придумайте новый пароль" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={errors.newPassword?.message} autoComplete="new-password" />
            )} />
            <Controller control={control} name="confirmNewPassword" render={({ field }) => (
              <PasswordField label="Повторите новый пароль" placeholder="Введите новый пароль ещё раз" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={errors.confirmNewPassword?.message} autoComplete="new-password" returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)} />
            )} />
            <Button size="lg" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? 'Сохраняем...' : 'Изменить пароль'}
            </Button>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
