import { apiPharma } from '@/lib/axios'

import type { ExitType } from './register-medicine-exit'

export interface FetchMedicinesExitsQuery {
  page?: number | null
  institutionId: string
  medicineId?: string | null
  operatorId?: string | null
  batch?: string | null
  exitType?: ExitType | null
  exitDate?: Date | null
  movementTypeId?: string | null
}

export interface MedicineExit {
  medicineExitId: string
  medicineStockId: string
  medicine: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  batchestockId: string
  batch: string
  quantity: number
  stock: string
  operator: string
  exitType: ExitType
  exitDate: Date
  movementType?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export interface FetchMedicinesExitsResponse {
  medicines_exits: MedicineExit[]
  meta: {
    page: number
    totalCount: number
  }
}

export async function fetchMedicinesExits(
  {
    institutionId,
    page,
    medicineId,
    operatorId,
    batch,
    exitDate,
    exitType,
    movementTypeId,
  }: FetchMedicinesExitsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMedicinesExitsResponse>(
    '/movement/exit',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        page,
        medicineId,
        operatorId,
        batch,
        exitDate,
        exitType,
        movementTypeId,
      },
    },
  )

  return response.data
}
