import { apiPharma } from '@/lib/axios'
export interface FetchMedicinesVariantsQuery {
  page?: number | null
  query?: string | null
  medicineId?: string | null
}

export interface MedicineVariant {
  id: string
  medicine: string
  medicineId: string
  dosage: string
  unitMeasure: string
  unitMeasureId: string
  pharmaceuticalForm: string
  pharmaceuticalFormId: string
}

export interface FetchMedicinesVariantsResponse {
  medicines_variants: MedicineVariant[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchMedicinesVariants(
  { page, query, medicineId }: FetchMedicinesVariantsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMedicinesVariantsResponse>(
    '/medicines-variants',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        query,
        medicineId,
      },
    },
  )

  return response.data
}
