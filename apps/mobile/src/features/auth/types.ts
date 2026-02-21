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

export type ProfileResponse = {
  user: {
    sub: string
    email: string
    iat: number
    exp: number
  }
}
