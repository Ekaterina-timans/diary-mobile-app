import { useAuthStore } from "@/src/features/auth/authStore";
import axios from "axios";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, useColorScheme } from "react-native";
import { deleteAccount } from "../../model/data.api";
import { removePin } from "@/src/shared/auth/pin";
import { setBiometricEnabled } from "@/src/shared/auth/biometricSettings";
import { setAutoLockOption } from "@/src/shared/auth/autoLockSettings";
import { setAppSwitcherProtectionEnabled } from "@/src/shared/auth/appSwitcherSettings";
import { Screen } from "@/src/shared/ui/Screen";
import { Header } from "@/src/shared/ui/navigation/Header";
import { Text, YStack } from "tamagui";
import { GlassCard } from "@/src/shared/ui/cards/GlassCard";
import { PasswordField } from "@/src/shared/ui/fields/PasswordField";
import { Button } from "@/src/shared/ui/button/Button";

function getDeleteErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return 'Не удалось удалить аккаунт. Попробуйте ещё раз'
  }

  if (error.response?.status === 401) {
    return 'Неверный пароль'
  }

  const message = error.response?.data?.message

  if (Array.isArray(message)) {
    return message[0] ?? 'Не удалось удалить аккаунт'
  }
  return typeof message === 'string'
    ? message
    : 'Не удалось удалить аккаунт'
}

export function DeleteAccount() {
  const isDark = useColorScheme() == 'dark'
  const signOut = useAuthStore((state) => state.signOut)

  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDeletion() {
    try {
      setDeleting(true)
      setPasswordError(null)

      await deleteAccount(password)
      await Promise.allSettled([
        removePin(),
        setBiometricEnabled(false),
        setAutoLockOption('immediately'),
        setAppSwitcherProtectionEnabled(false)
      ])

      await signOut()
      Alert.alert(
        'Аккаунт удален',
        'Через 30 дней данные будут удалены окончательно',
      )
    } catch (error) {
      setPasswordError(getDeleteErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  function requestDeletion() {
    if (password.length < 6) {
      setPasswordError('Введите текущий пароль')
      return
    }

    Alert.alert(
      'Удалить аккаунт?',
      'Вы потеряете доступ к дневникам, заметкам и другим данным. Через 30 дней они будут удалены окончательно.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            void confirmDeletion()
          },
        },
      ],
    )
  }

  return (
    <Screen>
      <Header title="Удаление аккаунта" />

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 40,
          }}
        >
          <YStack gap="$5">
            <GlassCard
              variant={isDark ? 'dark' : 'light'}
            >
              <YStack gap="$2">
                <Text
                  color="$danger"
                  fontSize="$7"
                  fontWeight="700"
                >
                  Удалить аккаунт
                </Text>

                <Text
                  color="$muted"
                  fontSize="$4"
                  lineHeight={21}
                >
                  Доступ к аккаунту будет закрыт сразу.
                  Дневники, заметки и остальные данные
                  будут окончательно удалены через 30 дней.
                </Text>
              </YStack>
            </GlassCard>

            <GlassCard
              variant={isDark ? 'dark' : 'light'}
            >
              <Text
                color="$text"
                fontSize="$5"
                fontWeight="600"
              >
                Подтвердите действие паролем
              </Text>

              <PasswordField
                label="Текущий пароль"
                placeholder="Введите пароль"
                value={password}
                onChangeText={(value) => {
                  setPassword(value)
                  setPasswordError(null)
                }}
                error={passwordError ?? undefined}
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={requestDeletion}
              />

              <Button
                variant="danger"
                size="lg"
                disabled={deleting}
                onPress={requestDeletion}
              >
                {deleting
                  ? 'Удаляем...'
                  : 'Удалить аккаунт'}
              </Button>
            </GlassCard>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}