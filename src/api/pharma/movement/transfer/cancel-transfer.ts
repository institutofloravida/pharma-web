import { apiPharma } from "@/lib/axios";

export interface CancelTransferParams {
  transferId: string;
}

export async function cancelTransfer(
  { transferId }: CancelTransferParams,
  token: string,
) {
  await apiPharma.post(
    `/movement/transfer/${transferId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
