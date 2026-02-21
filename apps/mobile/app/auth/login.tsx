import { useState } from 'react'
import { router } from 'expo-router'
import { Text, YStack } from 'tamagui'
import { useAuthStore } from '@/src/features/auth/authStore'
import { AuthLayout } from '@/src/features/auth/ui/AuthLayout'
import { TextField } from '@/src/shared/ui/fields/TextField'
import { Button } from '@/src/shared/ui/button/Button'
import { PasswordField } from '@/src/shared/ui/fields/PasswordField'

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setError(null)
      setLoading(true)
      await signIn(email.trim(), password)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Не удалось войти')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Вход">
      <YStack gap="$4">
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

        <Button variant="primary" size="lg" onPress={handleLogin} disabled={loading}>
          {loading ? 'Входим…' : 'Войти'}
        </Button>

        <Button variant="neutral" onPress={() => router.push('/auth/register')}>
          Нет аккаунта? Регистрация
        </Button>
      </YStack>
    </AuthLayout>
  )
}
