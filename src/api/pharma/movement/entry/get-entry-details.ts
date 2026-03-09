import { apiPharma } from '@/lib/axios'

export interface EntryDetailsBatch {
  batchNumber: string
  manufacturer: string
  manufacturingDate?: string
  expirationDate: string
  quantity: number
}

export interface EntryDetailsMedicine {
  medicineStockId: string
  medicineName: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  complement?: string
  batches: EntryDetailsBatch[]
}

export interface EntryDetails {
  id: string
  entryDate: string
  entryType: 'MOVEMENT_TYPE' | 'TRANSFER' | 'INVENTORY'
  movementType?: string
  nfNumber?: string
  operator: string
  stock: string
  medicines: EntryDetailsMedicine[]
}

export interface GetEntryDetailsResponse {
  entryDetails: EntryDetails
}

export async function getEntryDetails(id: string, token: string) {
  const response = await apiPharma.get<GetEntryDetailsResponse>(`/entry/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
