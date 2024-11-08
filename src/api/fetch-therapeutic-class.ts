import { api } from '@/lib/axios'
export interface FetchTherapeuticClassesQuery {
  page?: number | null
}

export interface TherapeuticClass {
  id: string
  name: string
  description: string
}

interface FetchTherapeuticClassesResponse {
  therapeutic_classes: TherapeuticClass[]
}

export async function fetchTherapeuticClasses(
  { page }: FetchTherapeuticClassesQuery,
  token: string,
) {
  const response = await api.get<FetchTherapeuticClassesResponse>(
    '/therapeutic-class',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
      },
    },
  )

  return response.data.therapeutic_classes
}
