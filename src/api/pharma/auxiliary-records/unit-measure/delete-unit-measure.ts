import { apiPharma } from "@/lib/axios";

export interface DeleteUnitMeasureBody {
  id: string;
}

export async function deleteUnitMeasure(
  { id }: DeleteUnitMeasureBody,
  token: string,
) {
  await apiPharma.delete(`/unit-measure/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
