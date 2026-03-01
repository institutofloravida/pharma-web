import { apiPharma } from '@/lib/axios'

export interface UpdatePathologyBody {
  pathologyId: string
  code?: string
  name?: string
}

export async function updatePathology(
  { pathologyId, code, name }: UpdatePathologyBody,
  token: string,
) {
  await apiPharma.put(
    `/pathology/${pathologyId}`,
    { code, name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
