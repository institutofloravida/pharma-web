import { apiPharma } from '@/lib/axios'

export interface RegisterManufacturerBody {
  name: string
  cnpj: string
  description?: string
}

export async function registerManufacturer(
  { name, cnpj, description }: RegisterManufacturerBody,
  token: string,
) {
  await apiPharma.post(
    '/manufacturer',
    { name, cnpj, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
