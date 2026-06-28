import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../authStore";
import { AppState, Platform } from "react-native";
import { getBiometricEnabled, setBiometricEnabled } from "@/src/shared/auth/biometricSettings";
import { authenticateWithBiometrics } from "@/src/shared/auth/biometric";
import { Text, YStack } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/src/shared/ui/button/Button";

type Status = 'checking' | 'locked' | 'unlocked'

export function BiometricLock({
  children,
  active,
}: PropsWithChildren<{ active:boolean }>) {
  const signOut = useAuthStore((state) => state.signOut)
  const [status, setStatus] = useState<Status>('checking')
  const authenticating = useRef(false)

  async function unlock() {
    if (!active || Platform.OS === 'web') {
      setStatus('unlocked')
      return
    }

    if (authenticating.current) {
      return
    }

    authenticating.current = true

    try {
      const enabled = await getBiometricEnabled()

      if (!enabled) {
        setStatus('unlocked')
        return
      }

      setStatus('locked')

      const result = await authenticateWithBiometrics()

      if (result.success) {
        setStatus('unlocked')
      }
    } catch {
      setStatus('locked')
    } finally {
      authenticating.current = false
    }
  }

  async function loginWithPassword() {
    await setBiometricEnabled(false)
    await signOut()
  }

  useEffect(() => {
    if (!active) {
      setStatus('checking')
      return
    }

    void unlock()
  }, [active])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
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