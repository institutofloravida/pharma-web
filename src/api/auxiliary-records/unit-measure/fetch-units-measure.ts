import { api } from '@/lib/axios'
export interface FetchUnitMeasuresQuery {
  page?: number | null
  query?: string | null
}

export interface UnitMeasure {
  id: string
  name: string
  acronym: string
}

interface FetchUnitMeasuresResponse {
  units_measure: UnitMeasure[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchUnitsMeasure(
  { page, query }: FetchUnitMeasuresQuery,
  token: string,
) {
  const response = await api.get<FetchUnitMeasuresResponse>('/unit-measure', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      query,
    },
  })

  return response.data
}
