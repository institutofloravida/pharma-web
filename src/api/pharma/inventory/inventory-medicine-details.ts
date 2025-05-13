import { apiPharma } from '@/lib/axios'

interface InventoryMedicineDetailsParams {
  medicineStockId: string
}

interface batchStockInventory {
  id: string
  code: string
  quantity: number
  expirationDate: Date
  manufacturingDate?: Date | null
  manufacturer: string
  isCloseToExpiration: boolean
  isExpired: boolean
}

interface InventoryMedicineDetailsResponse {
  inventory: {
    medicineStockId: string
    medicine: string
    dosage: string
    minimumLevel: number
    pharmaceuticalForm: string
    stockId: string
    totalQuantity: number
    unitMeasure: string
    quantity: {
      totalCurrent: number
      available: number
      unavailable: number
    }
    batchesStock: batchStockInventory[]
    isLowStock: boolean
    isZero: boolean
  }
}

export async function inventoryMedicineDetails(
  { medicineStockId }: InventoryMedicineDetailsParams,
  token: string,
) {
  const response = await apiPharma.get<InventoryMedicineDetailsResponse>(
    `/inventory/${medicineStockId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { inventory } = response.data

  return inventory
}
