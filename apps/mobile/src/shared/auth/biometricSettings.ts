import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStore'

// Хранит только пользовательский выбор включить биометрию, а не биометрические данные.
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'

// Возвращает, включал ли пользователь разблокировку по Face ID / Touch ID.
export async function getBiometricEnabled() {
  return (await getSecureItem(BIOMETRIC_ENABLED_KEY)) === 'true'
}

// Сохраняет включённую настройку или удаляет её при выключении.
export async function setBiometricEnabled(enabled: boolean) {
  if (enabled) {
    await setSecureItem(BIOMETRIC_ENABLED_KEY, 'true')
    return
  }

  await deleteSecureItem(BIOMETRIC_ENABLED_KEY)
}
