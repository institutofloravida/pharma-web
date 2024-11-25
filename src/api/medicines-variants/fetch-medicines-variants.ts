import { api } from '@/lib/axios'
export interface FetchMedicinesVariantsQuery {
  page?: number | null
}

export interface MedicineVariant {
  id: string
  medicine: string
  dosage: string
  unitMeasure: string
  pharmaceuticalForm: string
}

interface FetchMedicinesVariantsResponse {
  medicines_variants: MedicineVariant[]
}

export async function fetchMedicinesVariants(
  { page }: FetchMedicinesVariantsQuery,
  token: string,
) {
  const response = await api.get<FetchMedicinesVariantsResponse>(
    '/medicines-variants',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
      },
    },
  )

  return response.data.medicines_variants
}
