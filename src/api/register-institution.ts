import { api } from '@/lib/axios'

export interface RegisterInstitutionBody {
  name: string
  cnpj: string
  description?: string
}

export async function registerInstitution(
  { name, cnpj, description }: RegisterInstitutionBody,
  token: string,
) {
  await api.post(
    '/institutions',
    { name, cnpj, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
