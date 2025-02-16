import { apiPharma } from '@/lib/axios'

interface GetManufacturerParams {
  id: string
}

interface GetManufacturerResponse {
  manufacturer: {
    id: string
    name: string
    cnpj: string
    description: string
  }
}

export async function getManufacturer(
  { id }: GetManufacturerParams,
  token: string,
) {
  const response = await apiPharma.get<GetManufacturerResponse>(
    `/manufacturer/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { manufacturer } = response.data

  return manufacturer
}
