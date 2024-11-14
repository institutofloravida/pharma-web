import { api } from '@/lib/axios'
export interface FetchPathologiesQuery {
  page?: number | null
}

export interface Pathology {
  id: string
  name: string
}

interface FetchPathologiesResponse {
  pathologies: Pathology[]
}

export async function fetchPathologies(
  { page }: FetchPathologiesQuery,
  token: string,
) {
  const response = await api.get<FetchPathologiesResponse>('/pathologies', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.pathologies
}
