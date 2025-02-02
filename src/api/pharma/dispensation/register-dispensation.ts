import { apiPharma } from '@/lib/axios'

export interface RegisterDispensationBody {
  medicineVariantId: string
  stockId: string
  patientId: string
  batchesStocks: {
    batchStockId: string
    quantity: number
  }[]
  dispensationDate: Date
}

export async function registerDispensation(
  {
    batchesStocks,
    dispensationDate,
    medicineVariantId,
    patientId,
  }: RegisterDispensationBody,
  token: string,
) {
  await apiPharma.post(
    '/dispensation',
    {
      batchesStocks,
      dispensationDate,
      medicineVariantId,
      patientId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
