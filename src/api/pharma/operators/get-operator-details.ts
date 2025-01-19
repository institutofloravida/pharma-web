import { apiPharma } from '@/lib/axios'

import type { Operator } from './fetch-operators'

export interface GetOperatorDetailsResponse {
  operator: Operator
}

export async function getOperatorDetails(token: string) {
  const data = await apiPharma.get<GetOperatorDetailsResponse>('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data.data
}
