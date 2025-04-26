import { apiPharma } from '@/lib/axios'

import type { Operator } from '../operators/fetch-operators'

export interface ValidateTokenResponse {
  operator: Operator
}

export async function validateToken(token: string) {
  const data = await apiPharma.get<ValidateTokenResponse>('/validate-token', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data.data
}
