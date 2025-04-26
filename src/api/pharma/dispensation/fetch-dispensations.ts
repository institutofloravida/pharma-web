import { apiPharma } from '@/lib/axios'

export interface FetchDispensationsQuery {
  page: number | null
  patientId?: string | null
}

export interface Dispensation {
  id: string
  dispensationDate: string
  patientId: string
  patient: string
  operatorId: string
  operator: string
  items: number
}

interface FetchDispensationsResponse {
  dispensations: Dispensation[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchDispensations(
  { page, patientId }: FetchDispensationsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchDispensationsResponse>(
    '/dispensations',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        patientId,
      },
    },
  )

  return response.data
}
