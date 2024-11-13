import { api } from '@/lib/axios'
export interface FetchUnitMeasuresQuery {
  page?: number | null
}

export interface UnitMeasure {
  id: string
  name: string
  acronym: string
}

interface FetchUnitMeasuresResponse {
  units_measure: UnitMeasure[]
}

export async function fetchUnitsMeasure(
  { page }: FetchUnitMeasuresQuery,
  token: string,
) {
  const response = await api.get<FetchUnitMeasuresResponse>('/unit-measure', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.units_measure
}
