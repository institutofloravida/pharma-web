import { apiPharma } from '@/lib/axios'

export interface GetMonthlyMedicineUtilizationQuery {
  institutionId: string
  stockId?: string
  year: number
  month: number
}

export interface UseMedicine {
  id: string
  currentBalance: number
  previousBalance: number
  used: number
  medicineStockId: string
  year: number
  month: number
  medicine: string
  pharmaceuticalForm: string
  unitMeasure: string
  dosage: string
  complement: string | undefined
  createdAt: Date
}

interface GetMonthlyMedicineUtilizationResponse {
  utilization: UseMedicine[]
  totalUtilization: number
  meta: {
    totalCount: number
  }
}

export async function getMonthlyMedicineUtilization(
  { institutionId, stockId, month, year }: GetMonthlyMedicineUtilizationQuery,
  token: string,
) {
  const response = await apiPharma.get<GetMonthlyMedicineUtilizationResponse>(
    '/reports/monthly-utilization',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        stockId,
        year,
        month,
      },
    },
  )

  return response.data
}
