import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getOperators } from '@/api/operators/get-operators'
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

import { NewOperatorDialog } from './new-operator-dialog'
import { OperatorTableFilters } from './operator-table-filters'
import { OperatorTableRow } from './operator-table-row'

export function Operators() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: operatorsResult } = useQuery({
    queryKey: ['operators'],
    queryFn: () => getOperators({ page }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Operadores" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Operadores</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <OperatorTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Novo Operador
                </Button>
              </DialogTrigger>
              <NewOperatorDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[180px]">
                    Instituição Associada
                  </TableHead>
                  <TableHead className="w-[140px]">Tipo de usuário</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatorsResult?.operators &&
                  operatorsResult.operators.map((item) => {
                    return <OperatorTableRow operator={item} key={item.id} />
                  })}
              </TableBody>
            </Table>
          </div>

          {operatorsResult && (
            <Pagination
              pageIndex={operatorsResult.meta.page}
              totalCount={operatorsResult.meta.totalCount}
              perPage={20}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
