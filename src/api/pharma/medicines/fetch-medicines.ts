import { apiPharma } from '@/lib/axios'
export interface FetchMedicinesQuery {
  page?: number | null
  query?: string | null
  therapeuticClassesIds?: string[]
}

export interface Medicine {
  id: string
  name: string
  description: string
}

interface FetchMedicinesResponse {
  medicines: Medicine[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchMedicines(
  { page, query, therapeuticClassesIds }: FetchMedicinesQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMedicinesResponse>('/medicines', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      query,
      therapeuticClassesIds,
    },
  })

  return response.data
}
