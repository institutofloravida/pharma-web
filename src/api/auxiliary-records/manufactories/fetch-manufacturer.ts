import { api } from '@/lib/axios'
export interface FetchManufacturersQuery {
  page?: number | null
}

export interface Manufacturer {
  id: string
  name: string
  cnpj: string
  description?: string
}

interface FetchManufacturersResponse {
  manufacturers: Manufacturer[]
}

export async function fetchManufacturers(
  { page }: FetchManufacturersQuery,
  token: string,
) {
  const response = await api.get<FetchManufacturersResponse>('/manufacturer', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.manufacturers
}
