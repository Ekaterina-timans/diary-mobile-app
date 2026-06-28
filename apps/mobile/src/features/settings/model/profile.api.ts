import { api } from "@/src/shared/api/client"

export type ProfileDto = {
  id: string
  email: string
  displayName: string
  settings?: any
}

export type UpdateProfileDto = {
  displayName?: string
  email?: string
}

export type ChangePasswordDto = {
  currentPassword: string
  newPassword: string
}

export async function getProfile(): Promise<ProfileDto> {
  const { data } = await api.get('/users/profile')
  return data
}

export async function updateProfile(payload: UpdateProfileDto): Promise<ProfileDto> {
  const { data } = await api.patch('/users/profile', payload)
  return data
}

export async function changePassword(payload: ChangePasswordDto): Promise<{ ok: true }> {
  const { data } = await api.patch('/users/profile/password', payload)
  return data
}
