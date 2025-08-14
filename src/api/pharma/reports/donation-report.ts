import { apiPharma } from "@/lib/axios";
import type { MovementTypeDirection } from "@/lib/utils/movement-type";

import type { MedicineExit } from "../movement/exit/fetch-medicines-exits";

export interface GetDonationReportReportQuery {
  exitId: string;
}

export interface Movimentation {
  id: string;
  direction: MovementTypeDirection;
  medicine: string;
  batchCode: string;
  complement: string | null | undefined;
  dosage: string;
  pharmaceuticalForm: string;
  unitMeasure: string;
  stock: string;
  movementDate: Date;
  movementType: string;
  operator: string;
  quantity: number;
}

interface GetDonationReportReportResponse {
  exit: MedicineExit;
  movimentation: Movimentation[];
  meta: {
    totalCount: number;
  };
}

export async function getDonationReportReport(
  { exitId }: GetDonationReportReportQuery,
  token: string,
) {
  const response = await apiPharma.get<GetDonationReportReportResponse>(
    `/reports/donation/${exitId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
