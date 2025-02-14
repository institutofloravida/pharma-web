import { apiPharma } from '@/lib/axios'

interface GetInstitutionParams {
  id: string
}

interface GetInstitutionResponse {
  institution: {
    id: string
    name: string
    cnpj: string
    description: string | null
    createdAt: Date
    updatedAt: Date | null
  }
}

export async function getInstitution(
  { id }: GetInstitutionParams,
  token: string,
) {
  const response = await apiPharma.get<GetInstitutionResponse>(
    `/institution/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { institution } = response.data

  return institution
}
