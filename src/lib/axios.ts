import axios from 'axios'

import { env } from '@/env'
export const api = axios.create({
  baseURL: env.VITE_API_URL,
})

api.interceptors.request.use(async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return config
})
