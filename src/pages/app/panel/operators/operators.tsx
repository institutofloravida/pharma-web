import { Helmet } from 'react-helmet-async'

import { Pagination } from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { OperatorTableFilters } from './operator-table-filters'
import { OperatorTableRow } from './operator-table-row'

export function Operators() {
  return (
    <>
      <Helmet title="Operadores" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Operadores</h1>
        <div className="space-y-2.5">
          <OperatorTableFilters />
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
                {Array.from({ length: 10 }).map((_, i) => {
                  return <OperatorTableRow key={i} />
                })}
              </TableBody>
            </Table>
          </div>

          <Pagination />
        </div>
      </div>
    </>
  )
}
