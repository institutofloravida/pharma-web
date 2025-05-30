import { apiPharma } from '@/lib/axios'

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
    manufacturingDate?: Date | null
    quantityToEntry: number
  }[]
  entryDate: Date
  medicineVariantId: string
  stockId: string
  nfNumber: string
}

export async function registerMedicineEntry(
  {
    entryDate,
    movementTypeId,
    newBatches,
    batches,
    medicineVariantId,
    stockId,
    nfNumber,
  }: RegisterMedicineEntryBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/medicine-entry/stock/${stockId}/medicine-variant/${medicineVariantId}`,
    { entryDate, movementTypeId, batches, newBatches, nfNumber },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
