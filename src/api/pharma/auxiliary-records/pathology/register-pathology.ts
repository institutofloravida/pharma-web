import { apiPharma } from '@/lib/axios'

export interface RegisterPathologyBody {
  code: string
  name: string
}

export async function registerPathology(
  { code, name }: RegisterPathologyBody,
  token: string,
) {
  await apiPharma.post(
    '/pathology',
    { code, name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
