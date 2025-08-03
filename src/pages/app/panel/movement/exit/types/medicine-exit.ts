export interface MedicineStock {
  id: string
  medicine: string
  pharmaceuticalForm: string
  dosage: string
  unitMeasure: string
  quantity: {
    available: number
    unavailable: number
  }
}

export interface BatchStock {
  id: string
  batch: string
  expirationDate: string
  quantity: number
  isAvailable: boolean
  manufacturerName: string
}

export interface Stock {
  id: string
  name: string
  status: boolean
}

export interface MovementType {
  id: string
  name: string
}

export interface BatchExit {
  id: string
  batchStockId: string
  batch: BatchStock
  quantity: number
}

export interface MedicineExit {
  id: string
  medicineStockId: string
  medicine: MedicineStock
  batches: BatchExit[]
}
