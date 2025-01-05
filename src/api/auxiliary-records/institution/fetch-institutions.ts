import { api } from '@/lib/axios'
export interface FetchInstitutionsQuery {
  page?: number | null
}

export interface Institution {
  id: string
  name: string
  cnpj: string
  description: string
}

interface FetchInstitutionsResponse {
  institutions: Institution[]
}

export async function fetchInstitutions(
  { page }: FetchInstitutionsQuery,
  token: string,
) {
  const response = await api.get<FetchInstitutionsResponse>('/institutions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.institutions
}
