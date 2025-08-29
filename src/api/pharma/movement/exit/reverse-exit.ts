import { apiPharma } from "@/lib/axios";

export interface ReverseExitParams {
  exitId: string;
}

export async function reverseExit(
  { exitId }: ReverseExitParams,
  token: string,
) {
  await apiPharma.post(
    `/movement/exit/${exitId}/reverse`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
