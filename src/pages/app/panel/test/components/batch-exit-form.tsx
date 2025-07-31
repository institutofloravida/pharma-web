'use client'
import { Trash2 } from 'lucide-react'
import type { Control } from 'react-hook-form'
import { useFormState } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { MedicineExitFormSchema } from '../schemas/medicine-exit'
import type { BatchStock } from '../types/medicine-exit'

interface BatchExitFormProps {
  control: Control<MedicineExitFormSchema>
  medicineIndex: number
  batchIndex: number
  batch: BatchStock
  onRemove: () => void
  canRemove: boolean
}

export function BatchExitForm({
  control,
  medicineIndex,
  batchIndex,
  batch,
  onRemove,
  canRemove,
}: BatchExitFormProps) {
  const { errors } = useFormState({ control })

  const quantityError =
    errors?.medicines?.[medicineIndex]?.batches?.[batchIndex]?.quantity?.message

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 rounded border bg-muted/30 p-2">
        {/* Info do Lote */}
        <div className="col-span-4">
          <div className="text-sm font-medium">{batch.batch}</div>
          <div className="text-xs text-muted-foreground">
            {batch.manufacturerName}
          </div>
        </div>

        <div className="col-span-3">
          <div className="text-sm">
            Validade:{' '}
            {new Date(batch.expirationDate).toLocaleDateString('pt-BR')}
          </div>
          <div className="text-xs text-green-600">
            Disponível: {batch.quantity}
          </div>
        </div>

        {/* Quantidade */}
        <div className="col-span-4">
          <FormField
            control={control}
            name={`medicines.${medicineIndex}.batches.${batchIndex}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Quantidade"
                    min="0"
                    max={batch.quantity}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botão de Remover */}
        <div className="col-span-1 flex items-center justify-center">
          {canRemove && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRemove}
              className="h-7 w-7 bg-transparent text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
