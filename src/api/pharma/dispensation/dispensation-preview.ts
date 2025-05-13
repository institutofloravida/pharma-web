import { apiPharma } from '@/lib/axios'

interface DispensationPreviewParams {
  medicineStockId: string
  quantityRequired: number
}

interface DispensationPreviewResponse {
  dispensationPreview: {
    batchStockId: string
    code: string
    quantity: {
      toDispensation: number
      totalCurrent: number
    }
    expirationDate: Date
  }[]
}

export async function dispensationPreview(
  { medicineStockId, quantityRequired }: DispensationPreviewParams,
  token: string,
) {
  const response = await apiPharma.get<DispensationPreviewResponse>(
    `/dispensation/preview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        medicineStockId,
        quantityRequired,
      },
    },
  )

  const { dispensationPreview } = response.data

  return dispensationPreview
}
