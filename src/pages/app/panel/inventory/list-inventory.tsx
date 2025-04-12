'use client'

import { useQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInventory } from '@/api/pharma/inventory/fetch-inventory'
import { fetchMedicinesOnStock } from '@/api/pharma/stock/medicine-stock/fetch-medicines-stock'
// import { BatchDetails } from '@/components/medication/batch-details'
// import { LoadingState } from '@/components/medication/loading-state'
// import { MedicationFilters } from '@/components/medication/medication-filters'
// import { MedicationGrid } from '@/components/medication/medication-grid'
// import { MedicationList } from '@/components/medication/medication-list'
// import { PaginationControls } from '@/components/medication/pagination-controls'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/authContext'

import { InventoryTableFilters } from './inventory-filters'
import { MedicationGrid } from './medicine-grid'
import { MedicationList } from './medicine-list'

export function Inventory() {
  const { token, institutionId } = useAuth()
  const [viewMode, setViewMode] = useState('grid')
  const [searchParams, setSearchParams] = useSearchParams()

  const medicineName = searchParams.get('medicineName')
  const stockId = searchParams.get('stockId')
  const therapeuticClassesIdsParam = searchParams.get('therapeuticClassesIds')

  const therapeuticClassesIds = therapeuticClassesIdsParam
    ? therapeuticClassesIdsParam.split(',')
    : []

  const isLowStock = searchParams.get('isLowStock')

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const { data: inventoryResult, isFetching: isFetchingInventory } = useQuery({
    queryKey: [
      'inventory',
      institutionId,
      pageIndex,
      stockId,
      therapeuticClassesIds,
      medicineName,
      isLowStock,
    ],
    queryFn: () =>
      fetchInventory(
        {
          page: pageIndex,
          institutionId: institutionId ?? '',
          isLowStock: isLowStock !== null ? isLowStock === 'true' : undefined,
          medicineName,
          stockId,
          therapeuticClassesIds,
        },
        token ?? '',
      ),
  })
  return (
    <div className="container mx-auto py-6">
      <Card className="border-none shadow-md">
        <CardHeader className="rounded-t-lg bg-secondary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-secondary-foreground">
                Inventário de Medicamentos
              </CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Visualize seu estoque de medicamentos
              </CardDescription>
            </div>
            <Package className="h-8 w-8 text-secondary-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <>
            <InventoryTableFilters />
            {isFetchingInventory ? (
              <h1>aguarde....</h1>
            ) : (
              <>
                {viewMode === 'list' ? (
                  <MedicationList
                    inventory={inventoryResult?.inventory ?? []}
                  />
                ) : (
                  <MedicationGrid
                    inventory={inventoryResult?.inventory ?? []}
                  />
                )}
              </>
            )}
          </>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-destructive"></span>
              <span>Estoque Baixo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-amber-500 dark:bg-amber-600"></span>
              <span>Próximo da Validade</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
