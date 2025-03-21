import { z } from 'zod'

const envSchema = z.object({
  VITE_API_PHARMA_URL: z.string().url(),
  VITE_API_IBGE_URL: z.string().url(),
  VITE_API_VIA_CEP_URL: z.string().url(),
  VITE_MODE: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

export const env = envSchema.parse(import.meta.env)
