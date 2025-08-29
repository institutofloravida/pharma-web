import { apiPharma } from "@/lib/axios";

export interface FetchDispensationsQuery {
  page: number | null;
  patientId?: string | null;
  dispensationDate?: Date | null;
}

export interface Dispensation {
  id: string;
  dispensationDate: string;
  patientId: string;
  patient: string;
  operatorId: string;
  operator: string;
  items: number;
  exitId: string;
  reversedAt?: string | null;
}

interface FetchDispensationsResponse {
  dispensations: Dispensation[];
  meta: {
    page: number;
    totalCount: number;
  };
}

export async function fetchDispensations(
  { page, patientId, dispensationDate }: FetchDispensationsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchDispensationsResponse>(
    "/dispensations",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        patientId,
        dispensationDate,
      },
    },
  );

  return response.data;
}
