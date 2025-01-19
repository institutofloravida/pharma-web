import { apiPharma } from '@/lib/axios'
export interface FetchStocksQuery {
  page?: number | null
  query?: string
}

interface FetchStocksResponse {
  stocks: {
    id: string
    name: string
    status: boolean
    institutionName: string
  }[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchStocks(
  { page, query }: FetchStocksQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchStocksResponse>('/stocks', {
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
