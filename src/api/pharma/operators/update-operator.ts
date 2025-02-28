import { apiPharma } from '@/lib/axios'

export interface UpdateOperatorBody {
  operatorId: string
  name?: string
  email?: string
  role?: string
  institutionsIds?: string[]
}

export async function updateOperator(
  { operatorId, name, email, institutionsIds, role }: UpdateOperatorBody,
  token: string,
) {
  await apiPharma.put(
    `/operator/${operatorId}`,
    { name, email, institutionsIds, role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
