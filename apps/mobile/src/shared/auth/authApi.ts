import { api } from '../api/client'

// Контракт успешного ответа авторизации: данные пользователя и пара токенов сессии.
export type AuthRespose = {
  user: {
    id: string
    email: string
    displayName: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

// Создаёт аккаунт и возвращает сразу готовую авторизованную сессию.
export async function register(data: { email: string; password: string; displayName: string }) {
  const res = await api.post<AuthRespose>('/auth/register', data)
  return res.data
}

// Проверяет email и пароль, затем получает пользователя и токены от API.
export async function login(data: { email: string; password: string }) {
  const res = await api.post<AuthRespose>('/auth/login', data)
  return res.data
}

// Запрашивает новую пару токенов по refresh-токену, когда access-токен истёк.
export async function refresh(refreshToken: string, deviceId?: string) {
  const res = await api.post<AuthRespose>('/auth/refresh', {
    refreshToken,
    deviceId,
  })
  return res.data
}

// Сообщает серверу, что refresh-токен конкретного устройства больше не должен работать.
export async function logout(refreshToken: string) {
  await api.post('/auth/logout', { refreshToken })
}

// Проверяет текущую серверную сессию и возвращает пользователя из токена.
export async function getProfile() {
  const res = await api.get('/profile')
  return res.data as {
    user: {
      sub: string
      email: string
    }
  }
}
