import { apiPharma } from '@/lib/axios'

interface GetMedicineVariantParams {
  id: string
}

interface GetMedicineVariantResponse {
  medicine_variant: {
    id: string
    medicineId: string
    medicine: string
    dosage: string
    pharmaceuticalFormId: string
    pharmaceuticalForm: string
    unitMeasureId: string
    unitMeasure: string
    complement?: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export async function getMedicineVariant(
  { id }: GetMedicineVariantParams,
  token: string,
) {
  const response = await apiPharma.get<GetMedicineVariantResponse>(
    `/medicine-variant/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { medicine_variant: medicineVariant } = response.data

  return medicineVariant
}
