import { useState } from 'react'
import { router } from 'expo-router'
import { Text, YStack } from 'tamagui'
import { useAuthStore } from '@/src/features/auth/authStore'
import { AuthLayout } from '@/src/features/auth/ui/AuthLayout'
import { TextField } from '@/src/shared/ui/fields/TextField'
import { Button } from '@/src/shared/ui/button/Button'
import { PasswordField } from '@/src/shared/ui/fields/PasswordField'

export default function RegisterScreen() {
  const signUp = useAuthStore((s) => s.signUp)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    try {
      setError(null)
      setLoading(true)
      await signUp(email.trim(), password, displayName.trim())
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Не удалось создать аккаунт')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Регистрация">
      <YStack gap="$4">
        <TextField
          label="Имя"
          placeholder="Как к вам обращаться"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <TextField
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <PasswordField
          label="Пароль"
          placeholder="Минимум 6 символов"
          value={password}
          onChangeText={setPassword}
        />

        {error ? (
          <Text color="$danger" fontSize="$4">
            {error}
          </Text>
        ) : null}

        <Button variant="primary" size="lg" onPress={handleRegister} disabled={loading}>
          {loading ? 'Создаём…' : 'Создать аккаунт'}
        </Button>

        <Button variant="neutral" onPress={() => router.replace('/auth/login')}>
          Уже есть аккаунт? Войти
        </Button>
      </YStack>
    </AuthLayout>
  )
}
