import { apiPharma } from '@/lib/axios'

interface GetUserMetricsParams {
  institutionId: string
}

interface GetUserMetricsResponse {
  users: {
    total: number
    receiveMonth: number
  }
}

export async function GetUserMetrics(
  { institutionId }: GetUserMetricsParams,
  token: string,
) {
  const response = await apiPharma.get<GetUserMetricsResponse>(
    `/metrics/users/${institutionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data.users
}
