import { apiPharma } from '@/lib/axios'

import { Meta } from '../../_types/meta'
export interface FetchTherapeuticClassesQuery {
  page?: number | null
  query?: string | null
}

export interface TherapeuticClass {
  id: string
  name: string
  description: string
}

interface FetchTherapeuticClassesResponse {
  therapeutic_classes: TherapeuticClass[]
  meta: Meta
}

export async function fetchTherapeuticClasses(
  { page, query }: FetchTherapeuticClassesQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchTherapeuticClassesResponse>(
    '/therapeutic-class',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        query,
      },
    },
  )

  return response.data
}
