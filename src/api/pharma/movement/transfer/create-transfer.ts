import { apiPharma } from "@/lib/axios";
import type { ExitType } from "../exit/register-medicine-exit";

export interface CreateTransferBodyAndParams {
  batches: {
    batcheStockId: string;
    quantity: number;
  }[];
  stockId: string;
  exitType: ExitType;
  stockDestinationId?: string;
  transferDate?: Date;
}

export async function createTransfer(
  {
    transferDate,
    exitType,
    batches,
    stockId,
    stockDestinationId,
  }: CreateTransferBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/movimentation/transfer/`,
    {
      batches,
      exitType,
      stockId,
      stockDestinationId,
      transferDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
