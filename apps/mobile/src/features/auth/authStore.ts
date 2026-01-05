import { create } from 'zustand'
import { AuthState } from './types'
import { clearAccessToken, getAccessToken, saveAccessToken } from '@/src/shared/auth/tokenStore'
import { getDevToken, getProfile } from '@/src/shared/auth/authApi'

export const useAuthStore = create<AuthState>((set) => ({
  isReady: false,
  isAuthed: false,
  user: null,

  bootstrap: async () => {
    const token = await getAccessToken()
    if (!token) {
      set({ isReady: true, isAuthed: false, user: null })
      return
    }

    try {
      const res = await getProfile()
      set({
        isReady: true,
        isAuthed: true,
        user: { sub: res.user.sub, email: res.user.email },
      })
    } catch {
      await clearAccessToken()
      set({ isReady: true, isAuthed: false, user: null })
    }
  },

  signInDev: async () => {
    const { accessToken } = await getDevToken()
    await saveAccessToken(accessToken)
    const res = await getProfile()

    set({
      isReady: true,
      isAuthed: true,
      user: { sub: res.user.sub, email: res.user.email },
    })
  },

  signOut: async () => {
    await clearAccessToken()
    set({ isAuthed: false, user: null })
  },
}))
