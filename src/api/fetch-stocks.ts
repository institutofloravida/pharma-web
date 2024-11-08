import { api } from '@/lib/axios'
export interface FetchStocksQuery {
  page?: number | null
}

interface FetchStocksResponse {
  stocks: {
    id: string
    name: string
    status: boolean
    institutionId: string
  }[]
}

export async function fetchStocks({ page }: FetchStocksQuery, token: string) {
  const response = await api.get<FetchStocksResponse>('/stocks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.stocks
}
