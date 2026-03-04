'use client'

import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, List, Package } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInventory } from '@/api/pharma/inventory/fetch-inventory'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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

  function handlePagination(page: number) {
    setSearchParams((state) => {
      state.set('page', page.toString())
      return state
    })
  }

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
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                title="Visualização em grade"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                title="Visualização em lista"
              >
                <List className="h-4 w-4" />
              </Button>
              <Package className="ml-2 h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <InventoryTableFilters />

          {isFetchingInventory ? (
            <h1>aguarde....</h1>
          ) : viewMode === 'list' ? (
            <MedicationList inventory={inventoryResult?.inventory ?? []} />
          ) : (
            <MedicationGrid inventory={inventoryResult?.inventory ?? []} />
          )}

          <div className="mt-6 flex flex-col gap-4">
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

            {inventoryResult?.meta && (
              <Pagination
                pageIndex={inventoryResult.meta.page}
                totalCount={inventoryResult.meta.totalCount}
                perPage={10}
                onPageChange={handlePagination}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
