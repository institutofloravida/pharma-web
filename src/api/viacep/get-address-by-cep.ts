import { apiViaCep } from '@/lib/axios'

export interface Address {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export async function getAddressByCep(cep: string) {
  const response = await apiViaCep.get<Address>(`/${cep}/json`)
  return response.data
}
