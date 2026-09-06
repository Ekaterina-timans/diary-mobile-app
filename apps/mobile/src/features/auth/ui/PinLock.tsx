import { Fragment, PropsWithChildren, useEffect, useState } from "react"
import { useAuthStore } from "../authStore"
import { hasPin, removePin, verifyPin } from "@/src/shared/auth/pin"
import { Text, XStack, YStack } from "tamagui"
import { PinKeypad } from "@/src/shared/ui/pin/PinKeypad"
import { Button } from "@/src/shared/ui/button/Button"

const PIN_LENGTH = 4

type Status = 'checking' | 'locked' | 'unlocked'

type PinLockProps = PropsWithChildren<{
  active: boolean
}>

export function PinLock({ children, active }: PinLockProps) {
  const signOut = useAuthStore((state) => state.signOut)

  const [status, setStatus] = useState<Status>('checking')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  async function checkPinEnabled() {
    if (!active) {
      setStatus('unlocked')
      return
    }

    try {
      const enabled = await hasPin()
      setStatus(enabled ? 'locked' : 'unlocked')
    } catch {
      setStatus('unlocked')
    }
  }

  async function checkEnteredPin(value: string) {
    try {
      setIsChecking(true)
      const correct = await verifyPin(value)

      if (correct) {
        setPin('')
        setError(null)
        setStatus('unlocked')
        return
      }

      setPin('')
      setError('Неверный PIN. Попробуй ещё раз')
    } catch {
      setPin('')
      setError('Не удалось проверить PIN. Попробуйте ещё раз')
    } finally {
      setIsChecking(false)
    }
  }

  function handleDigitPress(digit: string) {
    if (pin.length >= PIN_LENGTH || isChecking) {
      return
    }

    const nextPin = `${pin}${digit}`
    setPin(nextPin)
    setError(null)

    if (nextPin.length === PIN_LENGTH) {
      void checkEnteredPin(nextPin)
    }
  }

  function handleDeletePress() {
    setPin((currentPin) => currentPin.slice(0, -1))
    setError(null)
  }

  function loginWithPassword() {
    void (async () => {
      await removePin()
      await signOut()
    })()
  }

  useEffect(() => {
    if (!active) {
      setStatus('unlocked')
      return
    }

    setStatus('checking')
    void checkPinEnabled()
  }, [active])

  if (!active || status === 'unlocked') {
    return children
  }

  if (status === 'checking') {
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
        justifyContent="space-between"
        padding="$6"
        paddingTop="$10"
        paddingBottom="$8"
        backgroundColor="$background"
      >
        <YStack alignItems="center" gap="$4">
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
              Введите PIN для доступа к записям
            </Text>
          </YStack>

          <XStack
            gap="$3"
            accessibilityLabel={`Введено цифр: ${pin.length} из ${PIN_LENGTH}`}
          >
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <YStack
                key={index}
                width={16}
                height={16}
                borderRadius={8}
                borderWidth={2}
                borderColor="$primary"
                backgroundColor={
                  index < pin.length ? '$primary' : 'transparent'
                }
              />
            ))}
          </XStack>

          {error ? (
            <Text color="$danger" fontSize="$3" textAlign="center">
              {error}
            </Text>
          ) : null}
        </YStack>

        <PinKeypad
          onDigitPress={handleDigitPress}
          onDeletePress={handleDeletePress}
          disabled={isChecking}
        />

        <Button variant="neutral" onPress={loginWithPassword}>
          Войти по паролю
        </Button>
      </YStack>
    </Fragment>
  )
}
