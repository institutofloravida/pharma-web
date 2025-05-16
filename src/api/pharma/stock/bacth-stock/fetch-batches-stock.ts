import { apiPharma } from '@/lib/axios'

import type { Meta } from '../../_types/meta'

export interface FetchBatchesOnStockParams {
  medicineStockId: string
  page?: number | null
  code?: string | null
}

interface BatchestockDetails {
  id: string
  stockId: string
  stock: string
  batchId: string
  batch: string
  medicineStockId: string
  medicineVariantId: string
  medicine: string
  pharmaceuticalForm: string
  unitMeasure: string
  dosage: string
  quantity: number
  expirationDate: Date
  isAvailable: boolean
  isCloseToExpiration: boolean
  isExpired: boolean
}

interface FetchBatchesOnStockReponse {
  batches_stock: BatchestockDetails[]
  meta: Meta
}

export async function fetchBatchesOnStock(
  { medicineStockId, code, page }: FetchBatchesOnStockParams,
  token: string,
) {
  const response = await apiPharma.get<FetchBatchesOnStockReponse>(
    'batch-stock',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        medicineStockId,
        code,
      },
    },
  )

  return response.data
}
