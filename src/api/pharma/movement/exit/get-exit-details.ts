import { apiPharma } from '@/lib/axios'

import type { ExitType } from './register-medicine-exit'

export interface ExitDetailsBatch {
  batchNumber: string
  manufacturer: string
  manufacturingDate?: string
  expirationDate: string
  quantity: number
}

export interface ExitDetailsMedicine {
  medicineStockId: string
  medicineName: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  complement?: string
  batches: ExitDetailsBatch[]
}

export interface ExitDetails {
  id: string
  exitDate: string
  exitType: ExitType
  movementType?: string
  destinationInstitution?: string
  responsibleByInstitution?: string
  reverseAt?: string | null
  operator: string
  stock: string
  medicines: ExitDetailsMedicine[]
}

export interface GetExitDetailsResponse {
  exitDetails: ExitDetails
}

export async function getExitDetails(id: string, token: string) {
  const response = await apiPharma.get<GetExitDetailsResponse>(`/exit/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
