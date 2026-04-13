import { apiPharma } from '@/lib/axios'

export interface CorrectionItem {
  movimentationId: string
  newQuantity: number
}

export interface CorrectMedicineEntryParams {
  entryId: string
  corrections: CorrectionItem[]
  nfNumber?: string
  entryDate?: string
  movementTypeId?: string
}

export async function correctMedicineEntry(
  { entryId, ...body }: CorrectMedicineEntryParams,
  token: string,
) {
  await apiPharma.post(`/movement/entry/${entryId}/correct`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
