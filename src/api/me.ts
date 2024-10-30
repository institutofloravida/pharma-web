import { api } from '@/lib/axios'

export interface SignInResponse {
  name: string
  email: string
  role: string
}

export async function signIn(token: string) {
  const data = await api.get<SignInResponse>('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data
}
