import { apiPharma } from '@/lib/axios'

export interface UpdatePharmaceuticalFormBody {
  pharmaceuticalFormId: string
  name?: string
}

export async function updatePharmaceuticalForm(
  { pharmaceuticalFormId, name }: UpdatePharmaceuticalFormBody,
  token: string,
) {
  await apiPharma.put(
    `/pharmaceutical-form/${pharmaceuticalFormId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
