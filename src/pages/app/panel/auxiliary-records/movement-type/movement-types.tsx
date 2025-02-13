import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchMovementTypes } from '@/api/pharma/auxiliary-records/movement-type/fetch-movement-types'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'

import { MovementTypeTableFilters } from './movement-type-table-filters'
import { MovementTypeTableRow } from './movement-type-table-row'
import { NewMovementTypeDialog } from './new-movement-type-dialog'

export function MovementTypes() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const { data: movementTypesResult } = useQuery({
    queryKey: ['movement-types'],
    queryFn: () => fetchMovementTypes({ page: pageIndex }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Tipos de Movimentação" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Classes Tipos de Movimentação
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <MovementTypeTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'default'}>Novo Tipo de Movimentção</Button>
              </DialogTrigger>
              <NewMovementTypeDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[180px]">Tipo</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movementTypesResult ? (
                  movementTypesResult.movement_types.map((item) => (
                    <MovementTypeTableRow movementType={item} key={item.id} />
                  ))
                ) : (
                  <div>Nenhum estoque encontrado</div>
                )}
              </TableBody>
            </Table>
          </div>

          {movementTypesResult && (
            <Pagination
              pageIndex={movementTypesResult.meta.page}
              totalCount={movementTypesResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
