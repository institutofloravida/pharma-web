import { apiPharma } from '@/lib/axios'

interface GetUnitMeasureParams {
  id: string
}

interface GetUnitMeasureResponse {
  unit_measure: {
    id: string
    name: string
    acronym: string
    createdAt: string
    updatedAt: string | null
  }
}

export async function getUnitMeasure(
  { id }: GetUnitMeasureParams,
  token: string,
) {
  const response = await apiPharma.get<GetUnitMeasureResponse>(
    `/unit-measure/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { unit_measure: unitMeasure } = response.data

  return unitMeasure
}
