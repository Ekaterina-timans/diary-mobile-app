import { deleteSecureItem, getSecureItem, setSecureItem } from '../storage/secureStore'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_toke'

export async function saveTokens(params: { accessToken: string; refreshToken: string }) {
  await setSecureItem(ACCESS_TOKEN_KEY, params.accessToken)
  await setSecureItem(REFRESH_TOKEN_KEY, params.refreshToken)
}

export async function getAccessToken() {
  return getSecureItem(ACCESS_TOKEN_KEY)
}

export async function getRefreshToken() {
  return getSecureItem(REFRESH_TOKEN_KEY)
}

export async function clearTokens() {
  await deleteSecureItem(ACCESS_TOKEN_KEY)
  await deleteSecureItem(REFRESH_TOKEN_KEY)
}
