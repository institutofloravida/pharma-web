import { apiPharma } from '@/lib/axios'

export interface FetchMostTreatedPathologiesQuery {
  institutionId?: string
}

export interface MostTreatedPathology {
  pathologyId: string
  pathologyName: string
  total: number
  percentage: number
}

interface FetchMostTreatedPathologiesResponse {
  mostTreatedPathologies: MostTreatedPathology[]
}

export async function fetchMostTreatedPathologies(
  { institutionId }: FetchMostTreatedPathologiesQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMostTreatedPathologiesResponse>(
    '/charts/most-treated-pathologies',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
      },
    },
  )

  return response.data
}
