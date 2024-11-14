import { api } from '@/lib/axios'

export interface RegisterPathologyBody {
  name: string
}

export async function registerPathology(
  { name }: RegisterPathologyBody,
  token: string,
) {
  await api.post(
    '/pathology',
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
