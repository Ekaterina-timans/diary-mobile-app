// Типы, которые описывают пользователя и публичный интерфейс Zustand-хранилища авторизации.
export type AuthUser = {
  id: string
  email: string
  displayName: string
}

export type AuthState = {
  isReady: boolean
  isAuthed: boolean
  user: AuthUser | null

  bootstrap: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

// Ответ эндпоинта профиля, где поля пользователя берутся из JWT на сервере.
export type ProfileResponse = {
  user: {
    sub: string
    email: string
    iat: number
    exp: number
  }
}
