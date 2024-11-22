import { api } from '@/lib/axios'

export interface RegisterMedicineBody {
  name: string
  description?: string
  therapeuticClassesIds: string[]
}

export async function registerMedicine(
  { name, description, therapeuticClassesIds }: RegisterMedicineBody,
  token: string,
) {
  await api.post(
    '/medicines',
    { name, description, therapeuticClassesIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
