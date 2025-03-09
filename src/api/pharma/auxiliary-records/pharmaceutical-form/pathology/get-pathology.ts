import { apiPharma } from '@/lib/axios'

interface GetPathologyParams {
  id: string
}

interface GetPathologyResponse {
  pathology: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date | null
  }
}

export async function getPathology({ id }: GetPathologyParams, token: string) {
  const response = await apiPharma.get<GetPathologyResponse>(
    `/pathology/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { pathology } = response.data

  return pathology
}
