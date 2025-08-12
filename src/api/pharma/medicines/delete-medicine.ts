import { apiPharma } from "@/lib/axios";

export interface DeleteMedicineBody {
  id: string;
}

export async function deleteMedicine(
  { id }: DeleteMedicineBody,
  token: string,
) {
  await apiPharma.delete(`/medicine/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
