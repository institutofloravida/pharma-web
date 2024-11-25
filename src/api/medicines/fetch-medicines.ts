import { api } from '@/lib/axios'
export interface FetchMedicinesQuery {
  page?: number | null
  query?: string | null
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
  { page, query }: FetchMedicinesQuery,
  token: string,
) {
  const response = await api.get<FetchMedicinesResponse>('/medicines', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      query,
    },
  })

  return response.data
}
