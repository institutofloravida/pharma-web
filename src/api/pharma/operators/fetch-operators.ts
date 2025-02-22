import { apiPharma } from '@/lib/axios'

import { OperatorRole } from './register-operator'
export interface GetOperatorsQuery {
  page?: number | null
  name?: string | null
  email?: string | null
  institutionId?: string | null
  role?: OperatorRole
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
  { page, email, institutionId, name, role }: GetOperatorsQuery,
  token: string,
) {
  const response = await apiPharma.get<GetOperatorsResponse>('/operator', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      email,
      institutionId,
      name,
      role,
    },
  })

  return response.data
}
