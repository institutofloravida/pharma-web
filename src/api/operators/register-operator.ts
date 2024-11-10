import { api } from '@/lib/axios'

export type OperatorRole = 'SUPER_ADMIN' | 'MANAGER' | 'COMMON'

export interface RegisterOperatorBody {
  name: string
  email: string
  password: string
  role: OperatorRole
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
