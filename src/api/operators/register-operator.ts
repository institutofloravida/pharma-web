import { api } from '@/lib/axios'

export type OperatorRole = 'SUPER_ADMIN' | 'MANAGER' | 'COMMON'

export interface RegisterOperatorBody {
  name: string
  email: string
  password: string
  role: OperatorRole
  institutionsIds: string[]
}

export async function registerOperator(
  { name, email, password, role, institutionsIds }: RegisterOperatorBody,
  token: string,
) {
  await api.post(
    '/accounts',
    {
      name,
      email,
      password,
      role,
      institutionsIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
