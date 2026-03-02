import { apiPharma } from '@/lib/axios'

interface GetStockSettingsParams {
  stockId: string
}

interface GetStockSettingsResponse {
  settings: {
    expirationWarningDays: number
  }
}

export async function getStockSettings(
  { stockId }: GetStockSettingsParams,
  token: string,
) {
  const response = await apiPharma.get<GetStockSettingsResponse>(
    `/stock/${stockId}/settings`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return response.data.settings
}
