import * as SecureStore from 'expo-secure-store'

// Небольшая обёртка над защищённым хранилищем iOS Keychain / Android Keystore.
// Через неё сохраняются секретные локальные данные: токены, PIN и настройки защиты.
export async function setSecureItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
}

export async function getSecureItem(key: string) {
  return SecureStore.getItemAsync(key)
}

export async function deleteSecureItem(key: string) {
  await SecureStore.deleteItemAsync(key)
}
