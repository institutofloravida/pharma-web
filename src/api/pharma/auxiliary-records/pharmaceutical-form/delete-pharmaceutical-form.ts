import { apiPharma } from "@/lib/axios";

export interface DeletePharmaceuticalFormBody {
  id: string;
}

export async function deletePharmaceuticalForm(
  { id }: DeletePharmaceuticalFormBody,
  token: string,
) {
  await apiPharma.delete(`/pharmaceutical-form/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
