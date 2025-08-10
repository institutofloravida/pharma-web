import { apiPharma } from "@/lib/axios";

export interface DeleteManufacturerBody {
  id: string;
}

export async function deleteManufacturer(
  { id }: DeleteManufacturerBody,
  token: string,
) {
  await apiPharma.delete(`/manufacturer/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
