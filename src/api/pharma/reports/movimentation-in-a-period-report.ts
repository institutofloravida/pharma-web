import { apiPharma } from '@/lib/axios'

import type { ExitType } from '../movement/exit/register-medicine-exit'

export interface GetMovimentationInAPeriodReportQuery {
  institutionId: string
  startDate: Date
  endDate: Date
  operatorId?: string
  medicineId?: string
  medicineVariantId?: string
  stockId?: string
  medicineStockId?: string
  batcheStockId?: string
  quantity?: number
  movementTypeId?: string
  exitType?: ExitType
}

export interface Movimentation {
  direction: string
  medicine: string
  batchCode: string
  complement: string | null | undefined
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  stock: string
  movementDate: Date
  movementType: string
  operator: string
  quantity: number
}

interface GetMovimentationInAPeriodReportResponse {
  movimentation: Movimentation[]
  meta: {
    totalCount: number
  }
}

export async function getMovimentationInAPeriodReport(
  {
    endDate,
    institutionId,
    startDate,
    operatorId,
    batcheStockId,
    exitType,
    medicineId,
    medicineStockId,
    medicineVariantId,
    movementTypeId,
    quantity,
    stockId,
  }: GetMovimentationInAPeriodReportQuery,
  token: string,
) {
  const response = await apiPharma.get<GetMovimentationInAPeriodReportResponse>(
    '/reports/movimentation',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        endDate,
        institutionId,
        startDate,
        operatorId,
        batcheStockId,
        exitType,
        medicineId,
        medicineStockId,
        medicineVariantId,
        movementTypeId,
        quantity,
        stockId,
      },
    },
  )

  return response.data
}
