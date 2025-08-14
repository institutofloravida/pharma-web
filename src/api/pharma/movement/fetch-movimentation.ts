import { apiPharma } from "@/lib/axios";
import type { Movimentation } from "../reports/donation-report";

export interface FetchMovimentationQuery {
  institutionId: string;
  page?: number | null;
}

export interface FetchMovimentationResponse {
  movimentation: Movimentation[];
  meta: {
    page: number;
    totalCount: number;
  };
}

export async function fetchMovimentation(
  { institutionId, page }: FetchMovimentationQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchMovimentationResponse>(
    "/movimentation",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        page,
      },
    },
  );

  return response.data;
}
