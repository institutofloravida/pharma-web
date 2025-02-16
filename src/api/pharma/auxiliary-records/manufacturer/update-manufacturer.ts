import { apiPharma } from '@/lib/axios'

export interface UpdateManufacturerBody {
  manufacturerId: string
  name?: string
  cnpj?: string
  description?: string
}

export async function updateManufacturer(
  { manufacturerId, name, cnpj, description }: UpdateManufacturerBody,
  token: string,
) {
  await apiPharma.put(
    `/manufacturer/${manufacturerId}`,
    { name, cnpj, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
