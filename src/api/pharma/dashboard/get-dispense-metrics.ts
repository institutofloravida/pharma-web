import { apiPharma } from '@/lib/axios'

interface GetDispenseMetricsParams {
  institutionId: string
}

interface GetDispenseMetricsResponse {
  dispense: {
    today: {
      total: number
      percentageAboveAverage: number
    }
    month: {
      total: number
      percentageComparedToLastMonth: number
    }
  }
}

export async function GetDispenseMetrics(
  { institutionId }: GetDispenseMetricsParams,
  token: string,
) {
  const response = await apiPharma.get<GetDispenseMetricsResponse>(
    `/metrics/dispense/${institutionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data.dispense
}
