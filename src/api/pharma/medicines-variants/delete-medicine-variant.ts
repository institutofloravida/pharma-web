import { apiPharma } from "@/lib/axios";

export interface DeleteMedicineVariantBody {
  id: string;
}

export async function deleteMedicineVariant(
  { id }: DeleteMedicineVariantBody,
  token: string,
) {
  await apiPharma.delete(`/medicine-variant/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
