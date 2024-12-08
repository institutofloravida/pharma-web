import { api } from '@/lib/axios'

export interface RegisterMedicineVariantBody {
  dosage: string
  medicineId: string
  pharmaceuticalFormId: string
  unitMeasureId: string
}

export async function registerMedicineVariant(
  {
    dosage,
    medicineId,
    pharmaceuticalFormId,
    unitMeasureId,
  }: RegisterMedicineVariantBody,
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
