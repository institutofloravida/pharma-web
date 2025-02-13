import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchPathologies } from '@/api/pharma/auxiliary-records/pathology/fetch-pathology'
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

import { NewPathologyDialog } from './new-pathology-dialog'
import { PathologyTableFilters } from './pathology-table-filters'
import { PathologyTableRow } from './pathology-table-row'

export function Pathologies() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: pathologiesResult } = useQuery({
    queryKey: ['pathologies', page],
    queryFn: () => fetchPathologies({ page }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Patologias" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Patologias</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <PathologyTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Nova Patologia
                </Button>
              </DialogTrigger>
              <NewPathologyDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pathologiesResult &&
                  pathologiesResult.pathologies.map((item) => {
                    return <PathologyTableRow pathology={item} key={item.id} />
                  })}
              </TableBody>
            </Table>
          </div>

          {pathologiesResult && (
            <Pagination
              pageIndex={pathologiesResult.meta.page}
              totalCount={pathologiesResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
