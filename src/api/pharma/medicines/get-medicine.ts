import { apiPharma } from '@/lib/axios'

interface GetMedicineParams {
  id: string
}

interface GetMedicineResponse {
  medicine: {
    id: any
    name: string
    description: string
    therapeuticsClasses: {
      id: string
      name: string
    }[]
  }
}

export async function getMedicine({ id }: GetMedicineParams, token: string) {
  const response = await apiPharma.get<GetMedicineResponse>(`/medicine/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const { medicine } = response.data

  return medicine
}
