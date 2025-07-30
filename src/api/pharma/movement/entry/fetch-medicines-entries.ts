import { apiPharma } from '@/lib/axios'
export interface FetchMedicinesEntriesQuery {
  institutionId: string
  page?: number | null
  operatorId?: string | null
  stockId?: string | null
}

export interface MedicineEntry {
  entryId: string
  stock: string
  entryDate: Date
  nfNumber: string
  operator: string
  items: number
}

export interface FetchMedicinesEntriesResponse {
  medicines_entries: MedicineEntry[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchMedicinesEntries(
  { institutionId, page, operatorId, stockId }: FetchMedicinesEntriesQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMedicinesEntriesResponse>(
    '/medicines-entries',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        page,
        operatorId,
        stockId,
      },
    },
  )

  return response.data
}
