import { create } from 'zustand'
import { AuthState } from './types'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '@/src/shared/auth/tokenStore'
import { getProfile, login, logout, register } from '@/src/shared/auth/authApi'

export const useAuthStore = create<AuthState>((set) => ({
  isReady: false,
  isAuthed: false,
  user: null,

  bootstrap: async () => {
    const access = await getAccessToken()

    if (!access) {
      set({ isReady: true, isAuthed: false })
      return
    }

    try {
      const res = await getProfile()
      set({
        isReady: true,
        isAuthed: true,
        user: {
          id: res.user.sub,
          email: res.user.email,
          displayName: '',
        },
      })
    } catch {
      await clearTokens()
      set({ isReady: true, isAuthed: false, user: null })
    }
  },

  signIn: async (email: string, password: string) => {
    const res = await login({ email, password })
    await saveTokens(res.tokens)

    set({
      isAuthed: true,
      user: res.user,
    })
  },

  signUp: async (email: string, password: string, displayName: string) => {
    const res = await register({ email, password, displayName })
    await saveTokens(res.tokens)

    set({
      isAuthed: true,
      user: res.user,
    })
  },

  signOut: async () => {
    const refresh = await getRefreshToken()
    if (refresh) {
      // try {
      //   await logout(refresh)
      // } catch {}
    }
    await clearTokens()

    set({
      isAuthed: false,
      user: null,
    })
  },
}))
