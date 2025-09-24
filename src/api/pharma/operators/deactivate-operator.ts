import { apiPharma } from "@/lib/axios";

export interface DeactivateOperatorParams {
  operatorId: string;
}

export async function deactivateOperator(
  { operatorId }: DeactivateOperatorParams,
  token: string,
) {
  await apiPharma.patch(
    `/operator/${operatorId}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
