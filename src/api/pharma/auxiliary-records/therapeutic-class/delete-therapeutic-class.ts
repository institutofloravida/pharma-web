import { apiPharma } from "@/lib/axios";

export interface DeleteTherapeuticClassBody {
  id: string;
}

export async function deleteTherapeuticClass(
  { id }: DeleteTherapeuticClassBody,
  token: string,
) {
  await apiPharma.delete(`/therapeutic-class/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
