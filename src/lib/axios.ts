import axios from 'axios'

import { env } from '@/env'
export const apiPharma = axios.create({
  baseURL: env.VITE_API_PHARMA_URL,
})

export const apiIBGE = axios.create({
  baseURL: env.VITE_API_IBGE_URL,
})
export const apiViaCep = axios.create({
  baseURL: env.VITE_API_VIA_CEP_URL,
})

//apiPharma.interceptors.request.use(async (config) => {
//  await new Promise((resolve) => setTimeout(resolve, 1000))
//  return config
//})
