import * as Crypto from 'expo-crypto'
import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStore'
// отвечает только за безопасное хранение и проверку PIN-кода
const PIN_HASH_KEY = 'pin_hash'
const PIN_SALT_KEY = 'pin_salt'
// Преобразует PIN в длинную зашифрованную строку — хеш
async function createPinHash(pin: string, salt: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`,
  )
}
// Проверяет, создавал ли пользователь PIN
export async function hasPin() {
  return (await getSecureItem(PIN_HASH_KEY)) !== null
}
// Сохраняет новый PIN
export async function savePin(pin: string) {
  const salt = Crypto.randomUUID()
  const hash = await createPinHash(pin, salt)

  await setSecureItem(PIN_SALT_KEY, salt)
  await setSecureItem(PIN_HASH_KEY, hash)
}
// Проверяет PIN, введённый пользователем
export async function verifyPin(pin: string) {
  const [salt, savedHash] = await Promise.all([
    getSecureItem(PIN_SALT_KEY),
    getSecureItem(PIN_HASH_KEY),
  ])

  if (!salt || !savedHash) {
    return false
  }

  const enteredHash = await createPinHash(pin, salt)

  return enteredHash === savedHash
}
// Удаляет из SecureStore хеш и salt
export async function removePin() {
  await Promise.all([
    deleteSecureItem(PIN_SALT_KEY),
    deleteSecureItem(PIN_HASH_KEY),
  ])
}