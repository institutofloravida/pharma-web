import { apiPharma } from "@/lib/axios";

export interface GetDispensesInAPeriodReportQuery {
  institutionId: string;
  startDate: Date;
  endDate: Date;
  patientId?: string;
  operatorId?: string;
}

export interface Dispensation {
  id: string;
  dispensationDate: string;
  patientId: string;
  patient: string;
  operatorId: string;
  operator: string;
  items: number;
  medicines: {
    medicine: string;
    pharmaceuticalForm: string;
    unitMeasure: string;
    complement: string | null;
    quantity: number;
    dosage: string;
    medicineStockId: string;
  }[];
}

interface GetDispensesInAPeriodReportResponse {
  dispenses: Dispensation[];
  meta: {
    totalCount: number;
  };
}

export async function getDispensesInAPeriodReport(
  {
    endDate,
    institutionId,
    startDate,
    operatorId,
    patientId,
  }: GetDispensesInAPeriodReportQuery,
  token: string,
) {
  const response = await apiPharma.get<GetDispensesInAPeriodReportResponse>(
    "/reports/dispenses",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        endDate,
        institutionId,
        startDate,
        operatorId,
        patientId,
      },
    },
  );

  return response.data;
}
