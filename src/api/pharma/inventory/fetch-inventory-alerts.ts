import { apiPharma } from '@/lib/axios'

interface FetchInventoryAlertsParams {
  institutionId: string
}

export interface ExpiringBatch {
  medicineStockId: string
  medicine: string
  stock: string
  stockId: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  complement?: string
  batchCode: string
  expirationDate: string
  quantity: number
  expirationWarningDays: number
}

export interface LowStockMedicine {
  medicineStockId: string
  medicine: string
  stock: string
  stockId: string
  currentQuantity: number
  minimumLevel: number
}

interface FetchInventoryAlertsResponse {
  expiringBatches: ExpiringBatch[]
  lowStockMedicines: LowStockMedicine[]
}

export async function fetchInventoryAlerts(
  { institutionId }: FetchInventoryAlertsParams,
  token: string,
) {
  const response = await apiPharma.get<FetchInventoryAlertsResponse>(
    '/inventory-alerts',
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { institutionId },
    },
  )
  return response.data
}
