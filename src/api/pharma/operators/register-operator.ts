import { apiPharma } from '@/lib/axios'

export enum OperatorRole{
  COMMON='COMMON',
  MANAGER='MANAGER',
  SUPER_ADMIN='SUPER_ADMIN'
}

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
  await apiPharma.post(
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
