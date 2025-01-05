import { api } from '@/lib/axios'

export interface RegisterStockBody {
  name: string
  institutionId: string
  status?: boolean
}

export async function registerStock(
  { name, institutionId, status }: RegisterStockBody,
  token: string,
) {
  await api.post(
    '/stock',
    { name, institutionId, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
