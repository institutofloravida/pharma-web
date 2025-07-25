import { apiPharma } from '@/lib/axios'

export interface RegisterMedicineEntryBodyAndParams {
  movementTypeId: string
  medicines: {
    medicineVariantId: string
    batches: Array<{
      code: string
      expirationDate: Date
      manufacturerId: string
      manufacturingDate?: Date
      quantityToEntry: number
    }>
  }[]
  entryDate: Date
  stockId: string
  nfNumber: string
}

export async function registerMedicineEntry(
  {
    entryDate,
    movementTypeId,
    medicines,
    stockId,
    nfNumber,
  }: RegisterMedicineEntryBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/medicine-entry`,
    { entryDate, movementTypeId, stockId, medicines, nfNumber },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
