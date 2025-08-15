import { apiPharma } from "@/lib/axios";

export interface ReverseExitBodyAndParams {
  exitId: string;
}

export async function reverseExit(
  { exitId }: ReverseExitBodyAndParams,
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
