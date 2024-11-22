import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchPathologies } from '@/api/auxiliary-records/pathology/fetch-pathology'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
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

  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: pathologies } = useQuery({
    queryKey: ['pathologies'],
    queryFn: () => fetchPathologies({ page }, token ?? ''),
  })

  console.log()

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
                {pathologies &&
                  pathologies.map((item) => {
                    return <PathologyTableRow pathology={item} key={item.id} />
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