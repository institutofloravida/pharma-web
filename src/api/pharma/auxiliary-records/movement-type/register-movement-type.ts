import { apiPharma } from '@/lib/axios'

export interface RegisterMovementTypeBody {
  content: string
  direction: 'ENTRY' | 'EXIT'
}

export async function registerMovementType(
  { content, direction }: RegisterMovementTypeBody,
  token: string,
) {
  await apiPharma.post(
    '/movement-type',
    { content, direction },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
