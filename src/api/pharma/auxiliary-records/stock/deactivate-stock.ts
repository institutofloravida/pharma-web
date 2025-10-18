import { apiPharma } from "@/lib/axios";

export interface DeactivateStockParams {
  stockId: string;
}

export async function deactivateStock(
  { stockId }: DeactivateStockParams,
  token: string,
) {
  await apiPharma.patch(
    `/stock/${stockId}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
