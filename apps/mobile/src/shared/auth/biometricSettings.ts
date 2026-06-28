import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStore'

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'

export async function getBiometricEnabled() {
  return (await getSecureItem(BIOMETRIC_ENABLED_KEY)) === 'true'
}

export async function setBiometricEnabled(enabled: boolean) {
  if (enabled) {
    await setSecureItem(BIOMETRIC_ENABLED_KEY, 'true')
    return
  }

  await deleteSecureItem(BIOMETRIC_ENABLED_KEY)
}
