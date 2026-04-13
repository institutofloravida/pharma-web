import { apiPharma } from '@/lib/axios'

interface UpdateBatchParams {
  batchId: string
  code?: string
  expirationDate?: string
  manufacturingDate?: string | null
}

export async function updateBatch(
  { batchId, code, expirationDate, manufacturingDate }: UpdateBatchParams,
  token: string,
) {
  await apiPharma.put(
    `/batches/${batchId}`,
    { code, expirationDate, manufacturingDate },
    { headers: { Authorization: `Bearer ${token}` } },
  )
}
