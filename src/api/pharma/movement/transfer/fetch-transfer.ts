import { apiPharma } from "@/lib/axios";

export enum TransferStatus {
  PENDING = "PENDING",
  COMPLETED = "CONFIRMED",
  CANCELLED = "CANCELED",
}

export interface FetchTransfersQuery {
  page?: number | null;
  institutionId: string;
  operatorId?: string | null;
  transferDate?: Date | null;
  status?: TransferStatus;
}

export interface TransferDetails {
  transferId: string;
  status: TransferStatus;
  transferDate: Date;
  confirmedAt?: Date | null;
  institutionOrigin: string;
  institutionOriginId: string;
  stockOrigin: string;
  institutionDestination?: string;
  institutionDestinationId?: string;
  stockDestination: string;
  operator: string;
  batches: number;
}

export interface FetchTransfersResponse {
  transfers: TransferDetails[];
  meta: {
    page: number;
    totalCount: number;
  };
}

export async function fetchTransfers(
  {
    institutionId,
    page,
    operatorId,
    status,
    transferDate,
  }: FetchTransfersQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchTransfersResponse>(
    "/movement/transfer",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        institutionId,
        page,
        operatorId,
        status,
        transferDate,
      },
    },
  );

  return response.data;
}
