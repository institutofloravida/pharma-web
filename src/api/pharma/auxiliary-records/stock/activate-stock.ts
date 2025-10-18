import { apiPharma } from "@/lib/axios";

export interface ActivateStockParams {
  stockId: string;
}

export async function activateStock(
  { stockId }: ActivateStockParams,
  token: string,
) {
  await apiPharma.patch(
    `/stock/${stockId}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
