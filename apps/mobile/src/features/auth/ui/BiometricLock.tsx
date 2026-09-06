import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../authStore";
import { AppState, Platform } from "react-native";
import { getBiometricEnabled, setBiometricEnabled } from "@/src/shared/auth/biometricSettings";
import { authenticateWithBiometrics } from "@/src/shared/auth/biometric";
import { Text, YStack } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/src/shared/ui/button/Button";

/*
“Замок” вокруг приложения
- Не пускает пользователя в приложение сразу, если включена защита
- Просит Face ID / Touch ID / отпечаток перед показом контента
- Снова блокирует приложение, когда оно уходит в фон
- Дает запасной путь через вход по паролю, если биометрия не сработала или пользователь не хочет ей пользоваться
*/
type Status = 'checking' | 'locked' | 'unlocked'

export function BiometricLock({
  children,
  active,
}: PropsWithChildren<{ active:boolean }>) {
  const signOut = useAuthStore((state) => state.signOut)
  const [status, setStatus] = useState<Status>('checking')
  const authenticating = useRef(false) // защита от повторных запросов
  // Биометрическая блокировка пропускается: если пользователь не авторизован или если приложение открыто в браузере
  async function unlock() {
    if (!active || Platform.OS === 'web') {
      setStatus('unlocked')
      return
    }
    // проверяется, не запущена ли биометрия
    if (authenticating.current) {
      return
    }

    authenticating.current = true

    try {
      const enabled = await getBiometricEnabled() // читает настройку

      if (!enabled) {
        setStatus('unlocked')
        return
      }

      setStatus('locked')

      const result = await authenticateWithBiometrics() // открывает системное окно Face ID / Touch ID

      if (result.success) {
        setStatus('unlocked')
      }
    } catch {
      setStatus('locked')
    } finally {
      authenticating.current = false
    }
  }
  // вход по паролю
  async function loginWithPassword() {
    await setBiometricEnabled(false) // Отключает биометрическую настройку
    await signOut() // Удаляет токены
  }
  // Проверка после авторизации
  useEffect(() => {
    if (!active) {
      setStatus('checking')
      return
    }

    void unlock()
  }, [active])
  // Возвращение из фона
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => { // следит за состоянием приложения
      if (!active) {
        return
      }

      if (nextState === 'active') {
        void unlock()
      } else {
        setStatus('locked')
      }
    })
    return () => subscription.remove()
  }, [active])
  // Отображение интерфейса
  if (!active || status === 'unlocked') {
    return children
  }

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      backgroundColor="$background"
    >
      <Feather name="lock" size={48} color="#6B5BFF" />

      <YStack alignItems="center" gap="$2">
        <Text color="$text" fontSize="$8" fontWeight="700">
          Дневник заблокирован
        </Text>

        <Text color="$muted" fontSize="$4" textAlign="center">
          Подтвердить личность с помощью Face ID или Touch ID
        </Text>
      </YStack>

      <Button size="lg" onPress={unlock}>
        Разблокировать
      </Button>

      <Button variant="neutral" onPress={loginWithPassword}>
        Войти по паролю
      </Button>
    </YStack>
  )
}