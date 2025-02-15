import { apiPharma } from '@/lib/axios'

interface GetTherapeuticClassParams {
  id: string
}

interface GetTherapeuticClassResponse {
  therapeutic_class: {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date | null
  }
}

export async function getTherapeuticClass(
  { id }: GetTherapeuticClassParams,
  token: string,
) {
  const response = await apiPharma.get<GetTherapeuticClassResponse>(
    `/therapeutic-class/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { therapeutic_class: therapeuticClass } = response.data

  return therapeuticClass
}
