import { api } from '@/lib/axios'
export interface FetchPharmaceuticalFormsQuery {
  page?: number | null
}

export interface PharmaceuticalForm {
  id: string
  name: string
}

interface FetchPharmaceuticalFormsResponse {
  pharmaceutical_forms: PharmaceuticalForm[]
}

export async function fetchPharmaceuticalForms(
  { page }: FetchPharmaceuticalFormsQuery,
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
      },
    },
  )

  return response.data.pharmaceutical_forms
}
