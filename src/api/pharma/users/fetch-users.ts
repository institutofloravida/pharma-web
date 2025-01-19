import { apiPharma } from '@/lib/axios'
import type { Race } from '@/lib/utils/race'

import type { Meta } from '../_types/meta'

export type Gender = 'F' | 'M' | 'O'

export interface FetchUsersQuery {
  page?: number | null
  name?: string | null
  cpf?: string | null
  sus?: string | null
  generalRegistration?: string | null
  birthDate?: Date | null
}

export interface User {
  id: string
  name: string
  sus: string
  cpf: string
  birthDate: string
  gender: Gender
  race: Race
  generalRegistration: string
}

interface FetchUsersResponse {
  patients: User[]
  meta: Meta
}

export async function fetchUsers({ page }: FetchUsersQuery, token: string) {
  const response = await apiPharma.get<FetchUsersResponse>('/patients', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
    },
  })

  return response.data
}
