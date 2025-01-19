import type { Meta } from '@/api/pharma/_types/meta'
import { apiPharma } from '@/lib/axios'
export interface FetchPathologiesQuery {
  page?: number | null
  query?: string | null
}

export interface Pathology {
  id: string
  name: string
}

interface FetchPathologiesResponse {
  pathologies: Pathology[]
  meta: Meta
}

export async function fetchPathologies(
  { page, query }: FetchPathologiesQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchPathologiesResponse>(
    '/pathologies',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        query,
      },
    },
  )

  return response.data
}
