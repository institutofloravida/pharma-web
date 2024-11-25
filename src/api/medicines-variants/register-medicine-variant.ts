import { api } from '@/lib/axios'

export interface RegisterMedicineBody {
  dosage: string
  medicineId: string
  pharmaceuticalFormId: string
  unitMeasureId: string
}

export async function registerMedicine(
  {
    dosage,
    medicineId,
    pharmaceuticalFormId,
    unitMeasureId,
  }: RegisterMedicineBody,
  token: string,
) {
  await api.post(
    '/medicine-variant',
    { dosage, medicineId, pharmaceuticalFormId, unitMeasureId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
