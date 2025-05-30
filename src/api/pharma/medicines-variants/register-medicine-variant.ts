import { apiPharma } from '@/lib/axios'

export interface RegisterMedicineVariantBody {
  dosage: string
  medicineId: string
  pharmaceuticalFormId: string
  unitMeasureId: string
  complement?: string | null
}

export async function registerMedicineVariant(
  {
    dosage,
    medicineId,
    pharmaceuticalFormId,
    unitMeasureId,
    complement,
  }: RegisterMedicineVariantBody,
  token: string,
) {
  await apiPharma.post(
    '/medicine-variant',
    { dosage, medicineId, pharmaceuticalFormId, unitMeasureId, complement },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
