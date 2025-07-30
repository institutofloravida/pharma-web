import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchMedicinesExits } from '@/api/pharma/movement/exit/fetch-medicines-exits'
import { ExitType } from '@/api/pharma/movement/exit/register-medicine-exit'
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

import { MedicineExitTableRow } from './medicine-exit-table-row'
import { MedicineExitTableFilters } from './medicine-exits-table-filters'
import { NewMedicineExitDialog } from './new-medicine-exit-dialog'

export function MedicinesExits() {
  const { token, institutionId } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const medicineId = searchParams.get('medicineId')
  const operatorId = searchParams.get('operatorId')
  const batch = searchParams.get('batch')
  const movementTypeId = searchParams.get('movementTypeId')
  const exitDate = searchParams.get('exitDate')

  const { data: medicinesExitsResult } = useQuery({
    queryKey: [
      'medicines-exits',
      'data-on-institution',
      pageIndex,
      medicineId,
      operatorId,
      batch,
      movementTypeId,
      exitDate,
    ],
    queryFn: () =>
      fetchMedicinesExits(
        {
          page: pageIndex,
          institutionId: institutionId ?? '',
          exitDate: exitDate ? new Date(exitDate) : undefined,
          operatorId,
        },
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
          Saídas de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-8">
            <MedicineExitTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Nova Saída
                </Button>
              </DialogTrigger>
              <NewMedicineExitDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="">Estoque</TableHead>
                  <TableHead className="">Operador</TableHead>
                  <TableHead className="w-[64px]">Items</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesExitsResult &&
                  medicinesExitsResult.medicines_exits.map((item) => {
                    return (
                      <MedicineExitTableRow medicineExit={item} key={item.id} />
                    )
                  })}
              </TableBody>
            </Table>
          </div>

          {medicinesExitsResult && (
            <Pagination
              pageIndex={medicinesExitsResult.meta.page}
              totalCount={medicinesExitsResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
