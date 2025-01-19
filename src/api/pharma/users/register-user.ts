import type { Address } from '@/api/viacep/get-address-by-cep'
import { apiPharma } from '@/lib/axios'
import type { Race } from '@/lib/utils/race'

import type { Gender } from './fetch-users'

export interface RegisterUserBody {
  name: string
  sus: string
  cpf: string
  birthDate: Date
  gender: Gender
  race: Race
  generalRegistration?: string
  pathologiesIds: string[]
  addressPatient: {
    city: string
    neighborhood: string
    number: string
    state: string
    street: string
    zipCode: string
    complement?: string
  }
}

export async function registerUser(
  {
    name,
    addressPatient,
    birthDate,
    cpf,
    gender,
    generalRegistration,
    race,
    sus,
    pathologiesIds,
  }: RegisterUserBody,
  token: string,
) {
  await apiPharma.post(
    '/patient',
    {
      name,
      addressPatient,
      birthDate,
      cpf,
      gender,
      generalRegistration,
      race,
      sus,
      pathologiesIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
