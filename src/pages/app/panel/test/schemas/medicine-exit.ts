import { z } from 'zod'

import { ExitType } from '@/api/pharma/movement/exit/register-medicine-exit'

export const batchExitSchema = z.object({
  batchStockId: z.string().min(1, 'Lote é obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
})

export const medicineExitSchema = z.object({
  medicineStockId: z.string().min(1, 'Medicamento é obrigatório'),
  batches: z.array(batchExitSchema).min(1, 'Pelo menos um lote é obrigatório'),
})

export const medicineExitFormSchema = z
  .object({
    stockId: z.string().min(1, 'Estoque é obrigatório'),
    exitType: z.nativeEnum(ExitType),
    movementTypeId: z.string().optional(),
    medicines: z
      .array(medicineExitSchema)
      .min(1, 'Pelo menos um medicamento é obrigatório'),
    exitDate: z.string().min(1, 'Data de saída é obrigatória'),
  })
  .superRefine((data, ctx) => {
    if (data.exitType === ExitType.MOVEMENT_TYPE && !data.movementTypeId) {
      ctx.addIssue({
        path: ['movementTypeId'],
        code: z.ZodIssueCode.custom,
        message: 'Selecione um tipo de movimentação.',
      })
    }
  })

export type MedicineExitFormSchema = z.infer<typeof medicineExitFormSchema>
export type MedicineExitSchema = z.infer<typeof medicineExitSchema>
export type BatchExitSchema = z.infer<typeof batchExitSchema>
