import { api } from '@/lib/axios'
export interface GetOperatorsQuery {
  page?: number | null
}

export interface Operator {
  id: string
  name: string
  email: string
  role: string
}

interface GetOperatorsResponse {
  operators: Operator[]
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
