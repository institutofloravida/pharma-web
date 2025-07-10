import { apiPharma } from '@/lib/axios'

export interface UpdateMedicineVariantBody {
  medicineVariantId: string
  dosage?: string
  pharmaceuticalFormId?: string
  unitMeasureId?: string
  complement?: string
}

export async function updateMedicineVariant(
  {
    medicineVariantId,
    dosage,
    pharmaceuticalFormId,
    unitMeasureId,
    complement,
  }: UpdateMedicineVariantBody,
  token: string,
) {
  await apiPharma.put(
    `/medicine-variant/${medicineVariantId}`,
    { dosage, pharmaceuticalFormId, unitMeasureId, complement },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
