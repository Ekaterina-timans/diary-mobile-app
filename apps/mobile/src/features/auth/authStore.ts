import { create } from 'zustand'
import { AuthState } from './types'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '@/src/shared/auth/tokenStore'
import { getProfile, login, logout, register } from '@/src/shared/auth/authApi'

// Единое Zustand-хранилище с состоянием сессии. Его читают роуты и экраны,
// чтобы понимать, завершена ли проверка авторизации и кто вошёл в приложение.
export const useAuthStore = create<AuthState>((set) => ({
  isReady: false,
  isAuthed: false,
  user: null,

  // Восстанавливает сессию при запуске: проверяет токен на устройстве,
  // затем запрашивает профиль, чтобы убедиться, что токен ещё действителен.
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

  // Входит в существующий аккаунт, сохраняет токены в SecureStore
  // и обновляет глобальное состояние приложения.
  signIn: async (email: string, password: string) => {
    const res = await login({ email, password })
    await saveTokens(res.tokens)

    set({
      isAuthed: true,
      user: res.user,
    })
  },

  // Регистрирует пользователя и сразу создаёт локальную авторизованную сессию.
  signUp: async (email: string, password: string, displayName: string) => {
    const res = await register({ email, password, displayName })
    await saveTokens(res.tokens)

    set({
      isAuthed: true,
      user: res.user,
    })
  },

  // Завершает сессию на устройстве: удаляет сохранённые токены и пользователя из Zustand.
  signOut: async () => {
    const refresh = await getRefreshToken()
    if (refresh) {
      // Позже здесь можно включить отзыв refresh-токена на сервере.
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
