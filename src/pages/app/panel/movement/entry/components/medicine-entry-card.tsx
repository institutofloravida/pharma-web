'use client'
import { Package, Plus, Trash2 } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

import type { MedicineVariant } from '@/api/pharma/medicines-variants/fetch-medicines-variants'
import type { BatchDetails } from '@/api/pharma/stock/batch/fetch-batches'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { BatchForm } from './batch-form'

export interface Batch {
  id: string
  batchNumber: string | undefined
  manufacturer: string | undefined
  manufacturingDate: string | undefined
  expirationDate: string | undefined
  quantity: number | undefined
}

export interface MedicationEntry {
  id: string
  medication: MedicineVariant
  batches: Batch[]
}

interface MedicationEntryCardProps {
  medicineIndex: number
  medicineField: any
  onRemove: () => void
  medicineVariant: any // agora recebe o objeto direto
  batches?: any[] // batches do form, para total reativo
}

export function MedicationEntryCard({
  medicineIndex,
  medicineField,
  onRemove,
  medicineVariant,
  batches,
}: MedicationEntryCardProps) {
  const {
    fields: batchFields,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({
    name: `medicines.${medicineIndex}.batches`,
  })

  // Usa batches do form se vierem como prop, senão usa batchFields
  const batchesToSum = batches ?? batchFields
  const totalQuantity = batchesToSum.reduce(
    (sum, batch) => Number(sum) + (Number(batch.quantityToEntry) || 0),
    0,
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-lg">
                {medicineVariant.medicine || 'Medicamento'}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {medicineVariant.dosage} {medicineVariant.unitMeasure} |{' '}
                {medicineVariant.pharmaceuticalForm}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Total: {totalQuantity}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={onRemove}
              className="bg-transparent text-destructive hover:text-destructive"
            >
              <Trash2 className="h-2 w-2" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-muted-foreground">
            Lotes ({batchFields.length})
          </h4>
          <Button
            onClick={() =>
              appendBatch({
                code: '',
                expirationDate: undefined,
                manufacturerId: '',
                manufacturingDate: undefined,
                quantityToEntry: 0,
              })
            }
            size="sm"
            className="gap-2"
          >
            <Plus className="h-2 w-2" />
            Adicionar Lote
          </Button>
        </div>
        <Separator />
        <div className="space-y-2">
          {/* Cabeçalho dos lotes */}
          <div className="grid grid-cols-12 gap-2 rounded bg-muted/50 px-2 py-1">
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Lote
              </span>
            </div>
            <div className="col-span-3">
              <span className="text-xs font-medium text-muted-foreground">
                Fabricante
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Fabricação
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Validade
              </span>
            </div>
            <div className="col-span-2">
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
          {batchFields.map((batch, batchIndex) => (
            <BatchForm
              key={batch.id}
              medicineIndex={medicineIndex}
              batchIndex={batchIndex}
              onRemove={() => removeBatch(batchIndex)}
              canRemove={batchFields.length > 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
