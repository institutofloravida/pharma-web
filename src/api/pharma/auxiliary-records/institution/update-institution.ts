import { apiPharma } from '@/lib/axios'

import type { InstitutionType } from './register-institution'

export interface UpdateInstitutionBody {
  institutionId: string
  name: string
  cnpj: string
  description?: string
  responsible: string
  type: InstitutionType
  controlStock: boolean
}

export async function updateInstitution(
  {
    institutionId,
    name,
    cnpj,
    description,
    controlStock,
    responsible,
    type,
  }: UpdateInstitutionBody,
  token: string,
) {
  await apiPharma.put(
    `/institution/${institutionId}`,
    { name, cnpj, description, responsible, type, controlStock },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
