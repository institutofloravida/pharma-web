import { api } from '@/lib/axios'

export interface RegisterOperatorBody {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'COMMOM'
}

export async function registerOperator(
  { name, email, password, role }: RegisterOperatorBody,
  token: string,
) {
  await api.post('/accounts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    name,
    email,
    password,
    role,
  })
}
