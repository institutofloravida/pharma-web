import { apiPharma } from '@/lib/axios'

export interface UpdateInstitutionBody {
  institutionId: string
  name?: string
  cnpj?: string
  description?: string
}

export async function updateInstitution(
  { institutionId, name, cnpj, description }: UpdateInstitutionBody,
  token: string,
) {
  await apiPharma.put(
    `/institution/${institutionId}`,
    { name, cnpj, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
