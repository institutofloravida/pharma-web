import { apiPharma } from "@/lib/axios";

import type { ExitType } from "./register-medicine-exit";

export interface FetchMedicinesExitsQuery {
  page?: number | null;
  institutionId: string;
  operatorId?: string | null;
  exitType?: ExitType | null;
  exitDate?: Date | null;
}

export interface MedicineExit {
  id: string;
  exitDate: Date;
  exitType: ExitType;
  operator: string;
  destinationInstitution?: string;
  responsibleByInstitution?: string;
  reverseAt?: Date | null;
  stock: string;
  items: number;
}

export interface FetchMedicinesExitsResponse {
  medicines_exits: MedicineExit[];
  meta: {
    page: number;
    totalCount: number;
  };
}

export async function fetchMedicinesExits(
  {
    institutionId,
    page,
    operatorId,
    exitDate,
    exitType,
  }: FetchMedicinesExitsQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMedicinesExitsResponse>(
    "/movement/exit",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        page,
        operatorId,
        exitDate,
        exitType,
      },
    },
  );

  return response.data;
}
