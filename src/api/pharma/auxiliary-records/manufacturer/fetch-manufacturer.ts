import { apiPharma } from '@/lib/axios'
export interface FetchManufacturersQuery {
  page?: number | null
  query?: string
  cnpj?: string
}

export interface Manufacturer {
  id: string
  name: string
  cnpj: string
  description?: string
}

interface FetchManufacturersResponse {
  manufacturers: Manufacturer[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchManufacturers(
  { page, query, cnpj }: FetchManufacturersQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchManufacturersResponse>('/manufacturer', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      query,
      cnpj,
    },
  })

  return response.data
}
