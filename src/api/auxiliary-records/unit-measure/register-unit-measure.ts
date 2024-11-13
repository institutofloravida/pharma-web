import { api } from '@/lib/axios'

export interface RegisterUnitMeasureBody {
  name: string
  acronym: string
}

export async function registerUnitMeasure(
  { name, acronym }: RegisterUnitMeasureBody,
  token: string,
) {
  await api.post(
    '/unit-measure',
    { name, acronym },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
