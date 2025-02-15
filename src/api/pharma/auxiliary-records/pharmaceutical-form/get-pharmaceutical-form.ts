import { apiPharma } from '@/lib/axios'

interface GetPharmaceuticalFormParams {
  id: string
}

interface GetPharmaceuticalFormResponse {
  pharmaceutical_form: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date | null
  }
}

export async function getPharmaceuticalForm(
  { id }: GetPharmaceuticalFormParams,
  token: string,
) {
  const response = await apiPharma.get<GetPharmaceuticalFormResponse>(
    `/pharmaceutical-form/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { pharmaceutical_form: pharmaceuticalForm } = response.data

  return pharmaceuticalForm
}
