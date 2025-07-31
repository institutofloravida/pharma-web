import { apiPharma } from '@/lib/axios'

import type { InstitutionType } from './register-institution'

interface GetInstitutionParams {
  id: string
}

interface GetInstitutionResponse {
  institution: {
    id: string
    name: string
    cnpj: string
    responsible: string
    type: InstitutionType
    controlStock: boolean
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
