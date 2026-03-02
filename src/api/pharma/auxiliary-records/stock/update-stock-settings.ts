import { apiPharma } from '@/lib/axios'

interface UpdateStockSettingsParams {
  stockId: string
  expirationWarningDays: number
}

export async function updateStockSettings(
  { stockId, expirationWarningDays }: UpdateStockSettingsParams,
  token: string,
) {
  await apiPharma.patch(
    `/stock/${stockId}/settings`,
    { expirationWarningDays },
    { headers: { Authorization: `Bearer ${token}` } },
  )
}
