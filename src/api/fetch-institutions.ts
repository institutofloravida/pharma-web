import { api } from '@/lib/axios'
export interface FetchInstitutionsQuery {
  page?: number | null
}

interface FetchInstitutionsResponse {
  institutions: {
    id: string
    name: string
    cnpj: string
    description: string
  }[]
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
