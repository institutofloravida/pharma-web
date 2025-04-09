import { apiPharma } from '@/lib/axios'

export interface FetchInventoryQuery {
  institutionId: string
  page?: number | null
  medicineName?: string | null
  stockId?: string | null
  isLowStock?: boolean | null
  therapeuticClassesIds?: string[] | null
}

interface FetchInventoryResponse {
  inventory: {
    medicineStockId: string
    stockId: string
    medicineVariantId: string
    pharmaceuticalForm: string
    unitMeasure: string
    dosage: string
    quantity: number
    bacthesStocks: number
    isLowStock: boolean
  }[]
}

export async function fetchInventory(
  {
    institutionId,
    page,
    isLowStock,
    medicineName,
    stockId,
    therapeuticClassesIds,
  }: FetchInventoryQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchInventoryResponse>('/inventory', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      institutionId,
      isLowStock,
      medicineName,
      stockId,
      therapeuticClassesIds,
    },
  })

  return response.data
}
