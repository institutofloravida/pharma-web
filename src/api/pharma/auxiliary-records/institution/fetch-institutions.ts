import { apiPharma } from '@/lib/axios'
export interface FetchInstitutionsQuery {
  page?: number | null
  query?: string | null
}

export interface Institution {
  id: string
  name: string
  cnpj: string
  description: string
}

interface FetchInstitutionsResponse {
  institutions: Institution[]
  meta: {
    page: number
    totalPage: number
  }
}

export async function fetchInstitutions(
  { page }: FetchInstitutionsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchInstitutionsResponse>('/institutions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data
}
