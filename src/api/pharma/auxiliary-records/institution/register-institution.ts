import { apiPharma } from '@/lib/axios'

export enum InstitutionType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  ONG = 'ONG',
}


export interface RegisterInstitutionBody {
  name: string
  cnpj: string
  responsible: string
  type: InstitutionType
  controlStock: boolean
  description?: string
}

export async function registerInstitution(
  { name, cnpj, description, responsible, type, controlStock }: RegisterInstitutionBody,
  token: string,
) {
  await apiPharma.post(
    '/institution',
    { name, cnpj, description, responsible, type, controlStock },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
