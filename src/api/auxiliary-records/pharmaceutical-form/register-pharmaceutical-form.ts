import { api } from '@/lib/axios'

export interface RegisterPharmaceuticalFormBody {
  name: string
}

export async function registerPharmaceuticalForm(
  { name }: RegisterPharmaceuticalFormBody,
  token: string,
) {
  await api.post(
    '/pharmaceutical-form',
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
