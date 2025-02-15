import { apiPharma } from '@/lib/axios'

import type { Meta } from '../../_types/meta'
export interface FetchInstitutionsQuery {
  page?: number | null
  query?: string | null
  cnpj?: string | null
}

export interface Institution {
  id: string
  name: string
  cnpj: string
  description: string
}

interface FetchInstitutionsResponse {
  institutions: Institution[]
  meta: Meta
}

export async function fetchInstitutions(
  { page, cnpj, query }: FetchInstitutionsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchInstitutionsResponse>(
    '/institutions',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        query,
        cnpj,
      },
    },
  )

  return response.data
}
