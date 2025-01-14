import { AxiosError } from 'axios'

import type { ApiError } from '@/api/_error/api-error'

export type ApiErrorResponse = AxiosError<ApiError>
