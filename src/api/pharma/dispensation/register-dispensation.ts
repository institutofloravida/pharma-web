import { apiPharma } from '@/lib/axios'

export interface RegisterDispensationBody {
  medicineStockId: string
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
    medicineStockId,
    patientId,
  }: RegisterDispensationBody,
  token: string,
) {
  await apiPharma.post(
    '/dispensation',
    {
      batchesStocks,
      dispensationDate,
      medicineStockId,
      patientId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
