import { api } from '../api/client'

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

export async function register(data: { email: string; password: string; displayName: string }) {
  const res = await api.post<AuthRespose>('/auth/register', data)
  return res.data
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post<AuthRespose>('/auth/login', data)
  return res.data
}

export async function refresh(refreshToken: string, deviceId?: string) {
  const res = await api.post<AuthRespose>('/auth/refresh', {
    refreshToken,
    deviceId,
  })
  return res.data
}

export async function logout(refreshToken: string) {
  await api.post('/auth/logout', { refreshToken })
}

export async function getProfile() {
  const res = await api.get('/profile')
  return res.data as {
    user: {
      sub: string
      email: string
    }
  }
}
