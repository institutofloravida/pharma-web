import { apiPharma } from "@/lib/axios";

export interface DeleteOperatorParams {
  operatorId: string;
}

export async function deleteOperator(
  { operatorId }: DeleteOperatorParams,
  token: string,
) {
  await apiPharma.delete(`/operator/${operatorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
