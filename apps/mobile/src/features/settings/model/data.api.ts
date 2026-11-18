import { api } from '@/src/shared/api/client'

type DeleteAccountResponse = {
  ok: true
}

// Подтверждает пароль и запускает на сервере отложенное удаление аккаунта.
export async function deleteAccount(password: string): Promise<DeleteAccountResponse> {
  const { data } = await api.delete<DeleteAccountResponse>('/users/account', {
    data: {
      password,
    },
  })
  return data
}
