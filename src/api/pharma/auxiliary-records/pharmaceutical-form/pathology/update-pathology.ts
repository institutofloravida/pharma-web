import { apiPharma } from '@/lib/axios'

export interface UpdatePathologyBody {
  pathologyId: string
  name?: string
}

export async function updatePathology(
  { pathologyId, name }: UpdatePathologyBody,
  token: string,
) {
  await apiPharma.put(
    `/pathology/${pathologyId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
