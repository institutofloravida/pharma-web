import { apiPharma } from '@/lib/axios'

export interface DispensationDetailsMedicine {
  medicineStockId: string
  medicine: string
  dosage: string
  pharmaceuticalForm: string
  unitMeasure: string
  complement?: string | null
  quantity: number
}

export interface DispensationDetails {
  id: string
  dispensationDate: string
  patientId: string
  patient: string
  operatorId: string
  operator: string
  items: number
  stock?: string
  reverseAt?: string | null
  medicines: DispensationDetailsMedicine[]
}

export interface GetDispensationDetailsResponse {
  dispensationDetails: DispensationDetails
}

export async function getDispensationDetails(id: string, token: string) {
  const response = await apiPharma.get<GetDispensationDetailsResponse>(
    `/dispensation/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}
