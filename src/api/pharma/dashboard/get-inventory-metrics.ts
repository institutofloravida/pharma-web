import { apiPharma } from '@/lib/axios'

interface GetInventoryMetricsParams {
  institutionId: string
}

interface GetInventoryMetricsResponse {
  inventory: {
    quantity: {
      totalCurrent: number
      available: number
      unavailable: number
      zero: number
      expired: number
    }
  }
  // dispense: {
  //   today: {
  //     total: number
  //     percentageAboveAverage: number
  //   }
  //   month: {
  //     total: number
  //     percentageComparedToLastMonth: number
  //   }
  // }
  // users: {
  //   total: number
  //   receiveMonth: number
  // }
}

export async function GetInventoryMetrics(
  { institutionId }: GetInventoryMetricsParams,
  token: string,
) {
  const response = await apiPharma.get<GetInventoryMetricsResponse>(
    `/metrics/inventory/${institutionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data.inventory
}
