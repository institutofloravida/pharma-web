import { api } from '@/lib/axios'

export interface RegisterTherapeuticClassBody {
  name: string
  description?: string
}

export async function registerTherapeuticClass(
  { name, description }: RegisterTherapeuticClassBody,
  token: string,
) {
  await api.post(
    '/therapeutic-class',
    { name, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
