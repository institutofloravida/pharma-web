import { apiPharma } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export interface SignInResponse {
  access_token: string
}
export async function signIn({ email, password }: SignInBody) {
  const data = await apiPharma.post<SignInResponse>('/sessions', {
    email,
    password,
  })

  return data
}
