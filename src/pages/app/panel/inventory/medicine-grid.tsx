'use client'

import { Box, ChevronRight, Layers, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { InventorySingle } from '@/api/pharma/inventory/fetch-inventory'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  getCategoryColor,
  getCategoryIcon,
  hasLowStock,
} from './inventory-utils'

interface MedicationGridProps {
  inventory: InventorySingle[]
}
export function MedicationGrid({ inventory }: MedicationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {inventory.length > 0 ? (
        inventory.map((medication) => (
          <MedicationCard
            key={medication.medicineStockId}
            medication={medication}
          />
        ))
      ) : (
        <div className="col-span-full py-12 text-center text-muted-foreground">
          Nenhum medicamento encontrado.
        </div>
      )}
    </div>
  )
}

interface MedicationCardProps {
  medication: InventorySingle
}

function MedicationCard({ medication }: MedicationCardProps) {
  // const categoryColor = getCategoryColor(medication.category)
  // const categoryIcon = getCategoryIcon(medication.category)

  const navigate = useNavigate()

  function redirect() {
    navigate(`/inventory/${medication.medicineStockId}`)
  }

  return (
    <Card
      className={`cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md dark:border-border dark:bg-opacity-10`}
    >
      <CardHeader className="flex flex-row items-start justify-between px-4 pb-2 pt-4">
        <div>
          <CardTitle className="text-lg font-bold">
            {medication.medicine}
          </CardTitle>
          <CardDescription className="text-sm">
            {medication.pharmaceuticalForm} • {medication.dosage}
            {medication.unitMeasure}
          </CardDescription>
        </div>
        <div className={`rounded-full p-2`}>
          <Package className={`h-5 w-5`} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span
              className={`font-medium ${hasLowStock(medication) ? 'text-destructive' : ''}`}
            >
              {medication.quantity.available} unidades
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span>{medication.bacthesStocks} lotes</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {hasLowStock(medication) && (
            <Badge variant="destructive" className="text-xs">
              Estoque Baixo
            </Badge>
          )}
          {/* <Badge
              variant="warning"
              className="bg-amber-500 text-xs dark:bg-amber-600"
            >
              Próximo da Validade
            </Badge> */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t bg-background/50 px-4 py-3 dark:border-border dark:bg-background/10">
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => {
            redirect()
          }}
        >
          Ver Lotes
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
