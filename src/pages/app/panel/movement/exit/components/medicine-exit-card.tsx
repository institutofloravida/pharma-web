'use client'
import { Package, Trash2 } from 'lucide-react'
import { type Control, useFieldArray, useWatch } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import type { MedicineExitFormSchema } from '../schemas/medicine-exit'
import type { BatchStock, MedicineStock } from '../types/medicine-exit'
import { BatchExitForm } from './batch-exit-form'
import { BatchStockSearch } from './batch-stock-search'

interface MedicineExitCardProps {
  control: Control<MedicineExitFormSchema>
  medicineIndex: number
  medicine: MedicineStock
  onRemove: () => void
}

export function MedicineExitCard({
  control,
  medicineIndex,
  medicine,
  onRemove,
}: MedicineExitCardProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `medicines.${medicineIndex}.batches`,
  })

  // Watch para calcular total em tempo real
  const batches = useWatch({
    control,
    name: `medicines.${medicineIndex}.batches`,
  })

  const totalQuantity =
    batches?.reduce((sum, batch) => sum + (batch?.quantity || 0), 0) || 0
  const selectedBatches = fields.map((field) => field.batch) as BatchStock[]

  const addBatch = (batch: BatchStock) => {
    append({
      batchStockId: batch.id,
      quantity: 0,
      batch,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-base">
                {medicine.medicine} - {medicine.pharmaceuticalForm} -{' '}
                {medicine.dosage}
                {medicine.unitMeasure}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Disponível: {medicine.quantity.available} | Indisponível:{' '}
                {medicine.quantity.unavailable}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              Total: {totalQuantity}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRemove}
              className="h-7 w-7 bg-transparent text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3 pt-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-muted-foreground">
            Lotes ({fields.length})
          </h4>
        </div>

        {/* Pesquisa de Lotes */}
        <BatchStockSearch
          onSelect={addBatch}
          selectedBatches={selectedBatches}
          medicineStockId={medicine.id}
        />

        <Separator />

        <div className="space-y-2">
          {/* Cabeçalho dos lotes */}
          <div className="grid grid-cols-12 gap-2 rounded bg-muted/50 px-2 py-1">
            <div className="col-span-4">
              <span className="text-xs font-medium text-muted-foreground">
                Lote / Fabricante
              </span>
            </div>
            <div className="col-span-3">
              <span className="text-xs font-medium text-muted-foreground">
                Validade / Disponível
              </span>
            </div>
            <div className="col-span-4">
              <span className="text-xs font-medium text-muted-foreground">
                Quantidade
              </span>
            </div>
            <div className="col-span-1">
              <span className="block text-center text-xs font-medium text-muted-foreground">
                Ações
              </span>
            </div>
          </div>

          {/* Lotes */}
          {fields.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Nenhum lote selecionado. Use o campo acima para adicionar lotes.
            </div>
          ) : (
            fields.map((field, batchIndex) => (
              <BatchExitForm
                key={field.id}
                control={control}
                medicineIndex={medicineIndex}
                batchIndex={batchIndex}
                batch={field.batch as BatchStock}
                onRemove={() => remove(batchIndex)}
                canRemove={fields.length > 1}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
