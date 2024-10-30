import { api } from '@/lib/axios'
export interface GetOperatorsQuery {
  page?: number | null
}

interface GetOperatorsResponse {
  operators: {
    id: string
    name: string
    email: string
    role: string
  }[]
}

export async function getOperators({ page }: GetOperatorsQuery, token: string) {
  const response = await api.get<GetOperatorsResponse>('/operators', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data.operators
}
