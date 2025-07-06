import { apiPharma } from '@/lib/axios'

import type { Meta } from '../../_types/meta'

export interface FetchBatchesParams {
  page?: number | null
  query?: string | null
}

export interface BatchDetails {
  id: string
  code: string
  manufacturerId: string
  manufacturingDate: string
  expirationDate: string
  createdAt: Date
  updatedAt: Date
}

interface FetchBatchesReponse {
  batches: BatchDetails[]
  meta: Meta
}

export async function fetchBatches(
  { query, page }: FetchBatchesParams,
  token: string,
) {
  const response = await apiPharma.get<FetchBatchesReponse>('batches', {
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
