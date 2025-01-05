import { api } from '@/lib/axios'

export interface RegisterMedicineEntryBodyAndParams {
  movementTypeId: string
  batches?: {
    batchId: string
    quantityToEntry: number
  }[]
  newBatches?: {
    code: string
    expirationDate: Date
    manufacturerId: string
    manufacturingDate: Date
    quantityToEntry: number
  }[]
  entryDate: Date
  medicineVariantId: string
  stockId: string
}

export async function registerMedicineEntry(
  {
    entryDate,
    movementTypeId,
    newBatches,
    batches,
    medicineVariantId,
    stockId,
  }: RegisterMedicineEntryBodyAndParams,
  token: string,
) {
  await api.post(
    `/entry/stock/${stockId}/medicine-variant/${medicineVariantId}`,
    { entryDate, movementTypeId, batches, newBatches },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}