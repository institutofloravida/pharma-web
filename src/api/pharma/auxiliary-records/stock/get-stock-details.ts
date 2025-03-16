import { apiPharma } from '@/lib/axios'

interface GetStockDetailsParams {
  id: string
}

interface GetStockDetailsResponse {
  stock: {
    id: string
    name: string
    status: boolean
    institutionName: string
    institutionId: string
    createdAt: string
    updatedAt: string | null | undefined
  }
}

export async function getStockDetails(
  { id }: GetStockDetailsParams,
  token: string,
) {
  const response = await apiPharma.get<GetStockDetailsResponse>(
    `/stock/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { stock } = response.data

  return stock
}
