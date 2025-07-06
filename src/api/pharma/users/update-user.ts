import { apiPharma } from '@/lib/axios'
import type { Race } from '@/lib/utils/race'

import type { Gender } from './fetch-users'

export interface UpdateUserBody {
  patientId: string
  name: string
  cpf?: string
  sus: string
  birthDate: Date
  gender: Gender
  race: Race
  generalRegistration?: string | null
  addressPatient: {
    street?: string
    number?: string
    complement?: string | null
    neighborhood: string
    city: string
    state: string
    zipCode?: string
  }
  pathologiesIds: string[]
}

export async function updateUser(
  {
    name,
    addressPatient,
    birthDate,
    gender,
    pathologiesIds,

    patientId,
    race,
    sus,
    cpf,
    generalRegistration,
  }: UpdateUserBody,
  token: string,
) {
  await apiPharma.put(
    `/patient/${patientId}`,
    {
      name,
      addressPatient,
      birthDate,
      gender,
      pathologiesIds,
      race,
      sus,
      cpf,
      generalRegistration,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
