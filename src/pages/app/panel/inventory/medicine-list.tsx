'use client'

import { ChevronRight } from 'lucide-react'

import { InventorySingle } from '@/api/pharma/inventory/fetch-inventory'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { hasLowStock } from './inventory-utils'

interface MedicationListProps {
  inventory: InventorySingle[]
}

export function MedicationList({ inventory }: MedicationListProps) {
  return (
    <div className="rounded-md border dark:border-border">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-border">
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Forma Farmacêutica</TableHead>
            <TableHead>Dosagem</TableHead>
            <TableHead className="text-center">Quantidade Total</TableHead>
            <TableHead className="text-center">Lotes</TableHead>
            <TableHead className="text-center">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length > 0 ? (
            inventory.map((medication) => (
              <TableRow
                key={medication.medicineStockId}
                className="cursor-pointer hover:bg-muted/50 dark:border-border"
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    {medication.medicine}
                    <div className="mt-1 flex gap-1">
                      {medication.isLowStock && (
                        <Badge variant="destructive" className="text-xs">
                          Estoque Baixo
                        </Badge>
                      )}
                      {/* {hasNearExpiryBatch(medication) && (
                        <Badge
                          variant="warning"
                          className="bg-amber-500 text-xs dark:bg-amber-600"
                        >
                          Próximo da Validade
                        </Badge>
                      )} */}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{medication.pharmaceuticalForm}</TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-medium ${hasLowStock(medication) ? 'text-destructive' : ''}`}
                  >
                    {medication.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {medication.bacthesStocks}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    Ver Lotes
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                Nenhum medicamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
