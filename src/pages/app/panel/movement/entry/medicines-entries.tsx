import { DialogContent } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchMedicinesEntries } from '@/api/pharma/movement/entry/fetch-medicines-entries'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'

import { MedicineEntryTableRow } from './medicine-entry-table-row'
import { MedicineVariantTableFilters } from './medicine-variant-table-filters'
import { NewMedicineEntryDialog } from './new-medicine-entry-dialog'
import { DatePickerForm } from './teste'

export function MedicinesEntries() {
  const { token, institutionId } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: medicinesEntriesResult } = useQuery({
    queryKey: ['medicines-entries', 'data-on-institution', pageIndex],
    queryFn: () =>
      fetchMedicinesEntries(
        { page: pageIndex, institutionId: institutionId ?? '' },
        token ?? '',
      ),
    enabled: Boolean(institutionId),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Entradas de medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Entradas de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <MedicineVariantTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Nova Entrada
                </Button>
              </DialogTrigger>
              <NewMedicineEntryDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="">Stock</TableHead>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead className="w-[64px]">Quantidade</TableHead>
                  <TableHead className="">Operador</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesEntriesResult &&
                  medicinesEntriesResult.medicines_entries.map((item) => {
                    return (
                      <MedicineEntryTableRow
                        medicineEntry={item}
                        key={item.medicineEntryId}
                      />
                    )
                  })}
              </TableBody>
            </Table>
          </div>

          {medicinesEntriesResult && (
            <Pagination
              pageIndex={medicinesEntriesResult.meta.page}
              totalCount={medicinesEntriesResult.meta.totalCount}
              perPage={20}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
