import { apiPharma } from '@/lib/axios'

export interface RegisterPathologyBody {
  name: string
}

export async function registerPathology(
  { name }: RegisterPathologyBody,
  token: string,
) {
  await apiPharma.post(
    '/pathology',
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
