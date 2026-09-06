import * as LocalAuthentication from 'expo-local-authentication'
import { Platform } from 'react-native'
/*
Общий слой для работы с биометрией в приложении
- Проверяет есть ли на устройстве биометрия и какая именно
- Запускает саму проверку отпечатка или Face ID
*/
export type BiometricInfo = {
  isAvailable: boolean
  name: 'Face ID' | 'Touch ID' | 'Отпечаток пальца' | null
}
// узнаёт возможности устройства
export async function getBiometricInfo(): Promise<BiometricInfo> {
  const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(), // есть ли биометрический датчик
    LocalAuthentication.isEnrolledAsync(), // настроено ли лицо или отпечаток
    LocalAuthentication.supportedAuthenticationTypesAsync(), // определяет Face ID, Touch ID или отпечаток
  ])

  const hasFaceRecognition = supportedTypes.includes(
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
  )

  const hasFingerprint = supportedTypes.includes(
    LocalAuthentication.AuthenticationType.FINGERPRINT,
  )

  let name: BiometricInfo['name'] = null

  if (hasFaceRecognition) {
    name = 'Face ID'
  } else if (hasFingerprint) {
    name = Platform.OS === 'ios' ? 'Touch ID' : 'Отпечаток пальца'
  }

  return {
    isAvailable: hasHardware && isEnrolled && name !== null,
    name,
  }
}

export async function authenticateWithBiometrics() {
  return LocalAuthentication.authenticateAsync({
    promptMessage: 'Вход в дневник',
    cancelLabel: 'Отмена',
    disableDeviceFallback: true,
    biometricsSecurityLevel: 'strong',
  })
}
