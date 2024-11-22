import { api } from '@/lib/axios'
export interface FetchMedicinesQuery {
  page?: number | null
}

export interface Medicine {
  id: string
  name: string
  description: string
}

interface FetchMedicinesResponse {
  medicines: Medicine[]
}

export async function fetchMedicines(
  { page }: FetchMedicinesQuery,
  token: string,
) {
  const response = await api.get<FetchMedicinesResponse>('/medicines', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.medicines
}
