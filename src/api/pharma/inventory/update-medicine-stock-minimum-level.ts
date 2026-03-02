import { apiPharma } from '@/lib/axios'

interface UpdateMedicineStockMinimumLevelParams {
  medicineStockId: string
  minimumLevel: number
}

export async function updateMedicineStockMinimumLevel(
  { medicineStockId, minimumLevel }: UpdateMedicineStockMinimumLevelParams,
  token: string,
) {
  await apiPharma.patch(
    `/medicine-stock/${medicineStockId}/minimum-level`,
    { minimumLevel },
    { headers: { Authorization: `Bearer ${token}` } },
  )
}
