import { api } from '../api/client'

export async function getDevToken() {
  const res = await api.get('/auth/dev-token')
  return res.data as { accessToken: string }
}

export async function getProfile() {
  const res = await api.get('/profile')
  return res.data as {
    user: { sub: string; email: string; iat: number; exp: number }
  }
}
