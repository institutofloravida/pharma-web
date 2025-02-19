import { apiPharma } from '@/lib/axios'

export interface UpdateUnitMeasureBody {
  unitMeasureId: string
  name?: string
  acronym?: string
}

export async function updateUnitMeasure(
  { unitMeasureId: unitmeasureId, name, acronym }: UpdateUnitMeasureBody,
  token: string,
) {
  await apiPharma.put(
    `/unit-measure/${unitmeasureId}`,
    { name, acronym },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
