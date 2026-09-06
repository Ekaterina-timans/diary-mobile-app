import { Fragment, PropsWithChildren, useEffect, useRef, useState } from "react"
import { useAuthStore } from "../authStore"
import { AppState, Platform } from "react-native"
import { getBiometricEnabled, setBiometricEnabled } from "@/src/shared/auth/biometricSettings"
import { hasPin } from "@/src/shared/auth/pin"
import { authenticateWithBiometrics } from "@/src/shared/auth/biometric"
import { PinLock } from "./PinLock"
import { Text, YStack } from "tamagui"
import { Feather } from "@expo/vector-icons"
import { Button } from "@/src/shared/ui/button/Button"
import { getAutoLockDelay, getAutoLockOption } from "@/src/shared/auth/autoLockSettings"

type LockMode = 'checking' | 'biometric' | 'pin' | 'unlocked'

type AppLockProps = PropsWithChildren<{
  active: boolean
}>

export function AppLock({ children, active }: AppLockProps) {
  const signOut = useAuthStore((state) => state.signOut)
  const [mode, setMode] = useState<LockMode>('checking')
  const [pinEnabled, setPinEnabled] = useState(false)
  const authenticating = useRef(false)
  const backgroundedAt = useRef<number | null>(null)

  async function checkProtection() {
    if (!active || Platform.OS === 'web') {
      setMode('unlocked')
      return
    }

    try {
      const [biometricEnabled, pinExists] = await Promise.all([
        getBiometricEnabled(),
        hasPin(),
      ])

      setPinEnabled(pinExists)

      if (biometricEnabled) {
        setMode('biometric')
        await unlockWithBiometrics(pinExists)
        return
      }

      if (pinExists) {
        setMode('pin')
        return
      }
      setMode('unlocked')
    } catch {
      setMode('unlocked')
    }
  }

  async function unlockWithBiometrics(pinExists = pinEnabled) {
    if (authenticating.current) {
      return
    }

    authenticating.current = true
    setMode('biometric')

    try {
      const result = await authenticateWithBiometrics()

      if (result.success) {
        setMode('unlocked')
        return
      }

      if (pinExists) {
        setMode('pin')
      }
    } catch {
      if (pinExists) {
        setMode('pin')
      }
    } finally {
      authenticating.current = false
    }
  }

  function openPin() {
    setMode('pin')
  }

  function loginWithPassword() {
    void (async () => {
      await setBiometricEnabled(false)
      await signOut()
    })()
  }

  async function handleAppBecameActive() {
    const leftAt = backgroundedAt.current
    backgroundedAt.current = null

    if (leftAt === null) {
      return
    }

    try {
      const option = await getAutoLockOption()
      const delay = getAutoLockDelay(option)

      if (delay === null) {
        setMode('unlocked')
        return
      }
      // leftAt — время сворачивания приложения
      const timeInBackground = Date.now() - leftAt
      // delay — выбранный пользователем интервал
      if (timeInBackground < delay) {
        setMode('unlocked')
        return
      }
      await checkProtection()
    } catch {
      await checkProtection()
    }
  }

  useEffect(() => {
    if (!active) {
      setMode('unlocked')
      return
    }

    setMode('checking')
    void checkProtection()
  }, [active])

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState) => {
        if (!active) {
          return
        }

        if (nextState === 'background') {
          if (backgroundedAt.current === null) {
            backgroundedAt.current = Date.now()
          }
          setMode('checking')
          return
        }

        if (nextState === 'active' && backgroundedAt.current !== null) {
          void handleAppBecameActive()
        }
      },
    )
    return () => subscription.remove()
  }, [active])
   
  if (!active || mode === 'unlocked') {
    return children
  }

  if (mode === 'pin') {
    return (
      <PinLock active={active}>
        {children}
      </PinLock>
    )
  }

  if (mode === 'checking') {
    return (
      <Fragment>
        {children}
        <YStack
          position="absolute"
          inset={0}
          zIndex={1000}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$background"
        >
          <Text color="$muted" fontSize="$4">
            Проверяем защиту...
          </Text>
        </YStack>
      </Fragment>
    )
  }

  return (
    <Fragment>
      {children}
      <YStack
        position="absolute"
        inset={0}
        zIndex={1000}
        alignItems="center"
        justifyContent="center"
        padding="$6"
        gap="$5"
        backgroundColor="$background"
      >
        <Feather name="lock" size={48} color="#6B5BFF" />

        <YStack alignItems="center" gap="$2">
          <Text
            color="$text"
            fontSize="$8"
            fontWeight="700"
            textAlign="center"
          >
            Дневник заблокирован
          </Text>

          <Text
            color="$muted"
            fontSize="$4"
            lineHeight={21}
            textAlign="center"
          >
            Подтвердите личность с помощью Face ID или Touch ID
          </Text>
        </YStack>

        <Button
          size="lg"
          onPress={() => void unlockWithBiometrics()}
        >
          Попробовать ещё раз
        </Button>

        {pinEnabled ? (
          <Button variant="neutral" onPress={openPin}>
            Войти по PIN
          </Button>
        ) : (
          <Button variant="neutral" onPress={loginWithPassword}>
            Войти по паролю
          </Button>
        )}
      </YStack>
    </Fragment>
  )
}
