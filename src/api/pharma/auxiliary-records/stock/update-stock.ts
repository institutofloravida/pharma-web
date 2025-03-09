import { apiPharma } from '@/lib/axios'

export interface UpdateStockBody {
  stockId: string
  name?: string
  status?: boolean
}

export async function updateStock(
  { stockId, name, status }: UpdateStockBody,
  token: string,
) {
  await apiPharma.put(
    `/stock/${stockId}`,
    { name, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
