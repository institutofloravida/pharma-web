import { apiPharma } from '@/lib/axios'

export interface UpdateTherapeuticClassBody {
  therapeuticClassId: string
  name?: string
  description?: string
}

export async function updateTherapeuticClass(
  { therapeuticClassId, name, description }: UpdateTherapeuticClassBody,
  token: string,
) {
  await apiPharma.put(
    `/therapeutic-class/${therapeuticClassId}`,
    { name, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
