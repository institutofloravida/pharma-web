import { apiPharma } from '@/lib/axios'

export interface RegisterInstitutionBody {
  name: string
  cnpj: string
  description?: string
}

export async function registerInstitution(
  { name, cnpj, description }: RegisterInstitutionBody,
  token: string,
) {
  await apiPharma.post(
    '/institution',
    { name, cnpj, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
