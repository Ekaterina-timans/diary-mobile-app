import { Platform } from 'react-native'
import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStore'
import * as ScreenCapture from 'expo-screen-capture'

const APP_SWITCHER_ENABLED_KEY = 'app_switcher_protection_enable'
const SCREEN_CAPTURE_KEY = 'app_switcher_protection'
// Читает настройку
export async function getAppSwitcherProtectionEnabled() {
  return (await getSecureItem(APP_SWITCHER_ENABLED_KEY)) === 'true'
}

async function applyAppSwitcherProtection(enabled: boolean) {
  if (Platform.OS === 'web') {
    return
  }
  // На iOS в App Switcher будет сильное размытие
  if (Platform.OS === 'ios') {
    if (enabled) {
      await ScreenCapture.enableAppSwitcherProtectionAsync(1)
    } else {
      await ScreenCapture.disableAppSwitcherProtectionAsync()
    }
    return
  }
  // На Android будет пустое превью. Также Android запретит скриншоты и запись экрана — это ограничение системного FLAG_SECURE
  if (Platform.OS === 'android') {
    if (enabled) {
      await ScreenCapture.preventScreenCaptureAsync(SCREEN_CAPTURE_KEY)
    } else {
      await ScreenCapture.allowScreenCaptureAsync(SCREEN_CAPTURE_KEY)
    }
  }
}
// Включает или отключает защиту и сохраняет выбор
export async function setAppSwitcherProtectionEnabled(enabled: boolean) {
  await applyAppSwitcherProtection(enabled)

  if (enabled) {
    await setSecureItem(APP_SWITCHER_ENABLED_KEY, 'true')
    return
  }

  await deleteSecureItem(APP_SWITCHER_ENABLED_KEY)
}
// Восстанавливает защиту после запуска приложения
export async function restoreAppSwitcherProtection() {
  const enabled = await getAppSwitcherProtectionEnabled()
  await applyAppSwitcherProtection(enabled)
}