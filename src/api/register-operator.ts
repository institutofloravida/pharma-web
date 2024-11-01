import { api } from '@/lib/axios'

export type RoleOperator = 'ADMIN' | 'COMMON'

export interface RegisterOperatorBody {
  name: string
  email: string
  password: string
  role: RoleOperator
}

export async function registerOperator(
  { name, email, password, role }: RegisterOperatorBody,
  token: string,
) {
  await api.post(
    '/accounts',
    {
      name,
      email,
      password,
      role,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
