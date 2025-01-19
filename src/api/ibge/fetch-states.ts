import { apiIBGE } from '@/lib/axios'

export interface State {
  id: number
  nome: string
  sigla: string
  regiao: {
    id: number
    nome: string
    sigla: string
  }
}

export async function fetchStates() {
  const response = await apiIBGE.get<State[]>(
    '/localidades/estados?orderBy=nome',
  )
  return response.data
}
