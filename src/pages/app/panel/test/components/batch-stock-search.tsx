'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, Search } from 'lucide-react'
import { useState } from 'react'

import { fetchBatchesOnStock } from '@/api/pharma/stock/bacth-stock/fetch-batches-stock'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/authContext'

import type { BatchStock } from '../types/medicine-exit'

interface BatchStockSearchProps {
  onSelect: (batch: BatchStock) => void
  selectedBatches: BatchStock[]
  medicineStockId: string
}

// Mock data - substitua pela sua API
const mockBatchesStock: BatchStock[] = [
  {
    id: '1',
    batch: 'L001',
    expirationDate: '2025-12-31',
    quantity: 50,
    isAvailable: true,
    manufacturerName: 'EMS Pharma',
  },
  {
    id: '2',
    batch: 'L002',
    expirationDate: '2025-06-30',
    quantity: 30,
    isAvailable: true,
    manufacturerName: 'Eurofarma',
  },
  {
    id: '3',
    batch: 'L003',
    expirationDate: '2024-12-31',
    quantity: 25,
    isAvailable: true,
    manufacturerName: 'Medley',
  },
]

export function BatchStockSearch({
  onSelect,
  selectedBatches,
  medicineStockId,
}: BatchStockSearchProps) {
  const { token } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [queryBatchesStock, setQueryBatchesStock] = useState('')

  const { data: batchesStockResult, isFetching: isFetchingBatchesStock } =
    useQuery({
      queryKey: ['batches-stock', medicineStockId, queryBatchesStock],
      queryFn: () =>
        fetchBatchesOnStock(
          {
            page: 1,
            medicineStockId,
            code: queryBatchesStock,
          },
          token ?? '',
        ),
      staleTime: 1000,
      enabled: !!medicineStockId,
      refetchOnMount: true,
    })

  const availableBatches = batchesStockResult?.batches_stock.filter(
    (batch) =>
      !selectedBatches.some((selected) => selected.id === batch.id) &&
      batch.isAvailable &&
      batch.quantity > 0,
  )

  const handleSelect = (batch: BatchStock) => {
    onSelect(batch)
    setOpen(false)
    setSearchValue('')
  }

  if (!medicineStockId) {
    return (
      <Button
        variant="outline"
        disabled
        className="h-10 w-full justify-between bg-transparent text-left"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Selecione um medicamento primeiro...
          </span>
        </div>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between bg-transparent text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Pesquisar lote...
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Digite o código do lote..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>Nenhum lote encontrado.</CommandEmpty>
            <CommandGroup>
              {availableBatches &&
                availableBatches.map((batch) => (
                  <CommandItem
                    key={batch.id}
                    value={batch.batch}
                    onSelect={() => handleSelect(batch)}
                    className="cursor-pointer"
                  >
                    <div className="flex w-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {batch.batch} - {'fabricante x'}
                        </span>
                        <div className="text-sm">
                          <span className="text-green-600">
                            {batch.quantity} disp.
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Validade:{' '}
                        {new Date(batch.expirationDate).toLocaleDateString(
                          'pt-BR',
                        )}
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
