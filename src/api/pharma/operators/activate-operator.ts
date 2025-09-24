import { apiPharma } from "@/lib/axios";

export interface ActivateOperatorParams {
  operatorId: string;
}

export async function activateOperator(
  { operatorId }: ActivateOperatorParams,
  token: string,
) {
  await apiPharma.patch(
    `/operator/${operatorId}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
