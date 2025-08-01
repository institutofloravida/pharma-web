import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
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

import { InstitutionTableFilters } from './institution-table-filters'
import { InstitutionTableRow } from './institution-table-row'
import { NewInstitutionDialog } from './new-institution-dialog'

export function Institutions() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('query')
  const cnpj = searchParams.get('cnpj')

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: institutionsResult } = useQuery({
    queryKey: ['institutions', pageIndex, query, cnpj],
    queryFn: () =>
      fetchInstitutions({ page: pageIndex, cnpj, query }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Instituições" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Instituições</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-6">
            <InstitutionTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Nova Instituição
                </Button>
              </DialogTrigger>
              <NewInstitutionDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">CNPJ</TableHead>
                  <TableHead className="">Responsável</TableHead>
                  <TableHead className="">Tipo</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutionsResult &&
                  institutionsResult.institutions.map((item) => {
                    return (
                      <InstitutionTableRow institution={item} key={item.id} />
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          {institutionsResult && (
            <Pagination
              pageIndex={institutionsResult.meta.page}
              perPage={10}
              onPageChange={handlePagination}
              totalCount={institutionsResult.meta.totalCount}
            />
          )}
        </div>
      </div>
    </>
  )
}
