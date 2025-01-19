import type { AxiosError } from 'axios'

import type { ApiError } from '@/api/pharma/_error/api-error'

export function handleApiError(error: unknown): string {
  if ((error as AxiosError<ApiError>)?.response?.data?.message) {
    return (error as AxiosError<ApiError>).response!.data.message
  }

  return 'Ocorreu um erro inesperado. Por favor, tente novamente.'
}
