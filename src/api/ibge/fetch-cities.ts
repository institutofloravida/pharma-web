import { apiIBGE } from '@/lib/axios'

export interface City {
  id: number
  nome: string
}

export async function fetchCities(acronym: string) {
  const response = await apiIBGE.get<City[]>(
    `/localidades/estados/${acronym}/municipios?orderBy=nome`,
  )
  return response.data
}
