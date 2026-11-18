import axios from 'axios'
import { API_BASE_URL } from '../constants/env'
import { getAccessToken } from '../auth/tokenStore'

// Общее Axios-подключение для всего мобильного приложения.
// Все feature API-файлы используют его, а не создают собственные экземпляры.
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
})
// Каждый запрос через api автоматически получает Authorization,
// если в защищённом хранилище есть access-токен.
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
