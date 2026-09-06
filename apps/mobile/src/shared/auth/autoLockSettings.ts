import { getSecureItem, setSecureItem } from "../storage/secureStore"

const AUTO_LOCK_KEY = 'auto_lock_delay'

export type AutoLockOption = 
  | 'immediately'
  | '1_minute'
  | '5_minute'
  | '15_minute'
  | 'never'

const DEFAULT_AUTO_LOCK: AutoLockOption = 'immediately'

const AUTO_LOCK_DELAYS: Record<Exclude<AutoLockOption, 'never'>, number> = {
  immediately: 0,
  '1_minute': 60 * 1000,
  '5_minute': 5 * 60 * 1000,
  '15_minute': 15 * 60 * 1000,
}

function isAutoLockOption(value: string): value is AutoLockOption {
  return (
    value === 'immediately' ||
    value === '1_minute' ||
    value === '5_minute' ||
    value === '15_minute' ||
    value === 'never'
  )
}
// Читает выбранный вариант, если пользователь ещё ничего не выбирал, используется immediately
export async function getAutoLockOption(): Promise<AutoLockOption> {
  const savedValue = await getSecureItem(AUTO_LOCK_KEY)

  if (!savedValue || !isAutoLockOption(savedValue)) {
    return DEFAULT_AUTO_LOCK
  }
  return savedValue
}
// Сохраняет выбор
export async function setAutoLockOption(option: AutoLockOption) {
  await setSecureItem(AUTO_LOCK_KEY, option)
}
// Переводит вариант в миллисекунды
export function getAutoLockDelay(option: AutoLockOption) {
  if (option === 'never') {
    return null
  }
  return AUTO_LOCK_DELAYS[option]
}