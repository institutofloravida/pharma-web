import { apiPharma } from '@/lib/axios'
import type { Race } from '@/lib/utils/race'

import type { Gender } from './fetch-users'

interface GetUserDetailsParams {
  id: string
}

interface GetUserDetailsResponse {
  patient: {
    id: string
    name: string
    cpf: string | null
    sus: string
    race: Race
    gender: Gender
    birthDate: Date
    age: number
    generalRegistration: string | null
    address: {
      id: string | null
      street?: string | null
      number?: string | null
      complement?: string | null
      neighborhood: string
      city: string
      state: string
      zipCode?: string | null
    }
    pathologies: {
      id: string
      name: string
      createdAt: Date
      updatedAt: Date | null | undefined
    }[]
  }
}

export async function getUserDetails(
  { id }: GetUserDetailsParams,
  token: string,
) {
  const response = await apiPharma.get<GetUserDetailsResponse>(
    `/patient/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { patient: user } = response.data

  return user
}
