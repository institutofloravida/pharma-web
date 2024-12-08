import { api } from '@/lib/axios'
export interface FetchPharmaceuticalFormsQuery {
  page?: number | null
  query?: string | null
}

export interface PharmaceuticalForm {
  id: string
  name: string
}

interface FetchPharmaceuticalFormsResponse {
  pharmaceutical_forms: PharmaceuticalForm[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchPharmaceuticalForms(
  { page, query }: FetchPharmaceuticalFormsQuery,
  token: string,
) {
  const response = await api.get<FetchPharmaceuticalFormsResponse>(
    '/pharmaceutical-form',
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
