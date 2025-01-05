import { api } from '@/lib/axios'
export interface FetchMedicinesEntriesQuery {
  institutionId: string
  page?: number | null
  medicineId?: string | null
  medicineVariantId?: string | null
  operatorId?: string | null
  stockId?: string | null
}

export interface MedicineEntry {
  medicineEntryId: string
  medicineId: string
  medicine: string
  medicineVariantId: string
  dosage: string
  pharmaceuticalFormId: string
  pharmaceuticalForm: string
  unitMeasureId: string
  unitMeasure: string
  stockId: string
  stock: string
  operatorId: string
  operator: string
  batchId: string
  batch: string
  quantityToEntry: number
  createdAt: Date
  updatedAt?: Date | null
}

export interface FetchMedicinesEntriesResponse {
  medicines_entries: MedicineEntry[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchMedicinesEntries(
  {
    institutionId,
    page,
    medicineId,
    medicineVariantId,
    operatorId,
    stockId,
  }: FetchMedicinesEntriesQuery,
  token: string,
) {
  const response = await api.get<FetchMedicinesEntriesResponse>(
    '/medicines-entries',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        page,
        medicineId,
        medicineVariantId,
        operatorId,
        stockId,
      },
    },
  )

  return response.data
}
