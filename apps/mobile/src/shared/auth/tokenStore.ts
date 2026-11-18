import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStore'

// Постоянные ключи SecureStore для токенов текущей сессии.
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_toke'

// Сохраняет access- и refresh-токены после входа или регистрации.
export async function saveTokens(params: { accessToken: string; refreshToken: string }) {
  await setSecureItem(ACCESS_TOKEN_KEY, params.accessToken)
  await setSecureItem(REFRESH_TOKEN_KEY, params.refreshToken)
}

// Возвращает короткоживущий токен, который добавляется в обычные запросы к API.
export async function getAccessToken() {
  return getSecureItem(ACCESS_TOKEN_KEY)
}

// Возвращает refresh-токен для обновления сессии или выхода на сервере.
export async function getRefreshToken() {
  return getSecureItem(REFRESH_TOKEN_KEY)
}

// Удаляет локальную сессию: после этого приложение считает пользователя гостем.
export async function clearTokens() {
  await deleteSecureItem(ACCESS_TOKEN_KEY)
  await deleteSecureItem(REFRESH_TOKEN_KEY)
}
