import { apiPharma } from '@/lib/axios'
import { MovementTypeDirection } from '@/lib/utils/movement-type'

import { Meta } from '../../_types/meta'
export interface FetchMovementTypesQuery {
  page?: number | null
  direction?: MovementTypeDirection
  query?: string
}

export interface MovementType {
  id: string
  name: string
  direction: MovementTypeDirection
}

export interface FetchMovementTypesResponse {
  movement_types: MovementType[]
  meta: Meta
}

export async function fetchMovementTypes(
  { page, direction, query }: FetchMovementTypesQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMovementTypesResponse>(
    '/movement-type',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        query,
        direction,
      },
    },
  )

  return response.data
}
