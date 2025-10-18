import { apiPharma } from "@/lib/axios";

export interface DeleteStockParams {
  stockId: string;
}

export async function deleteStock(
  { stockId }: DeleteStockParams,
  token: string,
) {
  await apiPharma.delete(`/stock/${stockId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
