import axios from 'axios'
import { API_BASE_URL } from '../constants/env'
import { getAccessToken } from '../auth/tokenStore'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
})
// любой запрос через api автоматически получает Authorization
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
