import { apiPharma } from "@/lib/axios";

export interface ConfirmTransferBodyAndParams {
  transferId: string;
}

export async function confirmTransfer(
  { transferId }: ConfirmTransferBodyAndParams,
  token: string,
) {
  await apiPharma.post(
    `/movement/transfer/${transferId}/confirm`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
