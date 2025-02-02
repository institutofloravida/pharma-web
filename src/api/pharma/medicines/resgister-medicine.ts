import { apiPharma } from '@/lib/axios'

export interface RegisterMedicineBody {
  name: string
  description?: string
  therapeuticClassesIds: string[]
}

export async function registerMedicine(
  { name, description, therapeuticClassesIds }: RegisterMedicineBody,
  token: string,
) {
  await apiPharma.post(
    '/medicine',
    { name, description, therapeuticClassesIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
