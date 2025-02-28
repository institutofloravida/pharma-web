import { apiPharma } from '@/lib/axios'

import type { OperatorRole } from './register-operator'

interface GetOperatorParams {
  id: string
}

interface GetOperatorResponse {
  operator: {
    id: string
    name: string
    email: string
    role: OperatorRole
    institutions: {
      id: string
      name: string
    }[]
    createdAt: Date
    updatedAt: Date | null
  }
}

export async function getOperator({ id }: GetOperatorParams, token: string) {
  const response = await apiPharma.get<GetOperatorResponse>(`/operator/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const { operator } = response.data

  return operator
}
