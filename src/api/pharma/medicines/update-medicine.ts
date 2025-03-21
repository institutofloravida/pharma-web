import { apiPharma } from '@/lib/axios'

export interface UpdateMedicineBody {
  medicineId: string
  name?: string
  description?: string
  therapeuticClassesIds?: string[]
}

export async function updateMedicine(
  { medicineId, name, description, therapeuticClassesIds }: UpdateMedicineBody,
  token: string,
) {
  await apiPharma.put(
    `/medicine/${medicineId}`,
    { name, description, therapeuticClassesIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
