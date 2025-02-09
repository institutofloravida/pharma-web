import { apiPharma } from '@/lib/axios'

import type { Meta } from '../../_types/meta'

export interface FetchMedicinesOnStockParams {
  stockId: string
  page?: number | null
  medicineName?: string | null
}

interface MedicineStockDetails {
  id: string
  stockId: string
  stock: string
  medicineVariantId: string
  medicine: string
  pharmaceuticalForm: string
  unitMeasure: string
  dosage: string
  quantity: number
}

interface FetchMedicinesOnStockReponse {
  medicines_stock: MedicineStockDetails[]
  meta: Meta
}

export async function fetchMedicinesOnStock(
  { stockId, medicineName, page }: FetchMedicinesOnStockParams,
  token: string,
) {
  const response = await apiPharma.get<FetchMedicinesOnStockReponse>(
    'medicine-stock',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        stockId,
        medicineName,
      },
    },
  )

  return response.data
}
