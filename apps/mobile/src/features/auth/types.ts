export type AuthUser = {
  sub: string
  email: string
}

export type AuthState = {
  isReady: boolean
  isAuthed: boolean
  user: AuthUser | null

  bootstrap: () => Promise<void>
  signInDev: () => Promise<void>
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