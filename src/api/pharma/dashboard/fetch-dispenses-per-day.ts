import { apiPharma } from '@/lib/axios'

export interface FetchDispensesPerDayQuery {
  institutionId: string
  startDate: Date
  endDate: Date
}

export interface DispensationPerDay {
  dispensationDate: string
  total: number
}

interface FetchDispensesPerDayResponse {
  dispenses: DispensationPerDay[]
  meta: {
    totalCount: number
  }
}

export async function fetchDispensesPerDay(
  { institutionId, startDate, endDate }: FetchDispensesPerDayQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchDispensesPerDayResponse>(
    '/charts/dispenses-per-day',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        startDate,
        endDate,
      },
    },
  )

  return response.data
}
