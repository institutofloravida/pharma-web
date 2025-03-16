import { apiPharma } from '@/lib/axios'
export interface FetchStocksQuery {
  page?: number | null
  query?: string | null
  institutionsIds?: string[]
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
  { page, query, institutionsIds }: FetchStocksQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchStocksResponse>('/stocks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      query,
      institutionsIds,
    },
  })

  return response.data
}
