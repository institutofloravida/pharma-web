import { apiPharma } from "@/lib/axios";

export interface DeletePathologyBody {
  id: string;
}

export async function deletePathology(
  { id }: DeletePathologyBody,
  token: string,
) {
  await apiPharma.delete(`/pathology/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
