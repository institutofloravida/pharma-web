import { apiPharma } from "@/lib/axios";
import type { TransferStatus } from "./fetch-transfer";

interface GetTransferParams {
  id: string;
}

interface GetTransferResponse {
  transfer: {
    transferId: string;
    status: TransferStatus;
    transferDate: Date;
    confirmedAt?: Date | null;
    institutionOrigin: string;
    stockOrigin: string;
    institutionDestination?: string;
    stockDestination: string;
    operator: string;
    batches: {
      medicine: string;
      pharmaceuticalForm: string;
      unitMeasure: string;
      dosage: string;
      complement?: string;
      batchId: string;
      code: string;
      manufacturer: string;
      expirationDate: Date;
      quantity: number;
    }[];
  };
}

export async function getTransfer({ id }: GetTransferParams, token: string) {
  const response = await apiPharma.get<GetTransferResponse>(
    `/movement/transfer/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { transfer } = response.data;

  return transfer;
}
