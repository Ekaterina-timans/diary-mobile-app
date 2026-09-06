import { router } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

import { savePin } from '@/src/shared/auth/pin'
import { Screen } from '@/src/shared/ui/Screen'
import { Header } from '@/src/shared/ui/navigation/Header'
import { PinKeypad } from '@/src/shared/ui/pin/PinKeypad'

const PIN_LENGTH = 4

type Step = 'create' | 'confirm'

export function SetupPin() {
  const [step, setStep] = useState<Step>('create')
  const [pin, setPin] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function completePin(value: string) {
    if (step === 'create') {
      setFirstPin(value)
      setPin('')
      setStep('confirm')
      setError(null)
      return
    }

    if (value !== firstPin) {
      setPin('')
      setFirstPin('')
      setStep('create')
      setError('PIN-коды не совпали. Придумайте PIN ещё раз')
      return
    }

    try {
      setIsSaving(true)
      await savePin(value)
      Alert.alert('PIN установлен', 'Теперь его можно использовать для защиты дневника', [
        { text: 'Готово', onPress: () => router.back() },
      ])
    } catch {
      setPin('')
      setError('Не удалось сохранить PIN. Попробуйте ещё раз')
    } finally {
      setIsSaving(false)
    }
  }

  function handleDigitPress(digit: string) {
    if (pin.length >= PIN_LENGTH || isSaving) {
      return
    }

    const nextPin = `${pin}${digit}`
    setPin(nextPin)
    setError(null)

    if (nextPin.length === PIN_LENGTH) {
      void completePin(nextPin)
    }
  }

  function handleDeletePress() {
    setPin((currentPin) => currentPin.slice(0, -1))
    setError(null)
  }

  return (
    <Screen>
      <Header title="Вход по PIN" />

      <YStack flex={1} alignItems="center" justifyContent="space-between" paddingBottom="$5">
        <YStack alignItems="center" gap="$4" paddingTop="$6">
          <YStack alignItems="center" gap="$2">
            <Text color="$text" fontSize="$8" fontWeight="700" textAlign="center">
              {step === 'create' ? 'Придумайте PIN' : 'Повторите PIN'}
            </Text>
            <Text color="$muted" fontSize="$4" lineHeight={21} textAlign="center">
              {step === 'create'
                ? 'Введите 4 цифры, которые сможете запомнить'
                : 'Введите тот же PIN ещё раз для подтверждения'}
            </Text>
          </YStack>

          <XStack gap="$3" accessibilityLabel={`Введено цифр: ${pin.length} из ${PIN_LENGTH}`}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <YStack
                key={index}
                width={16}
                height={16}
                borderRadius={8}
                borderWidth={2}
                borderColor="$primary"
                backgroundColor={index < pin.length ? '$primary' : 'transparent'}
              />
            ))}
          </XStack>

          {error ? (
            <Text color="$danger" fontSize="$3" textAlign="center" maxWidth={300}>
              {error}
            </Text>
          ) : null}
        </YStack>

        <PinKeypad
          onDigitPress={handleDigitPress}
          onDeletePress={handleDeletePress}
          disabled={isSaving}
        />
      </YStack>
    </Screen>
  )
}
