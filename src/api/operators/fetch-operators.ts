import { api } from '@/lib/axios'
export interface GetOperatorsQuery {
  page?: number | null
}

export interface Operator {
  id: string
  name: string
  email: string
  role: string
  institutions: {
    id: string
    name: string
  }[]
}

interface GetOperatorsResponse {
  operators: Operator[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchOperators(
  { page }: GetOperatorsQuery,
  token: string,
) {
  const response = await api.get<GetOperatorsResponse>('/operators', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data
}
