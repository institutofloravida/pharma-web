import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchTherapeuticClasses } from '@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'

import { NewTherapeuticClassDialog } from './new-therapeutic-class-dialog'
import { StockTableFilters } from './therapeutic-class-table-filters'
import { TherapeuticClassTableRow } from './therapeutic-class-table-row'

export function TherapeuticClass() {
  const { token } = useAuth()
  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: therapeuticClasses } = useQuery({
    queryKey: ['therapeutic-class'],
    queryFn: () => fetchTherapeuticClasses({ page }, token ?? ''),
  })

  return (
    <>
      <Helmet title="Terapêuticas" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Classes Terapêuticas
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <StockTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'default'}>Nova Classe Terapeutica</Button>
              </DialogTrigger>
              <NewTherapeuticClassDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[180px]">Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {therapeuticClasses?.length ? (
                  therapeuticClasses.map((item) => (
                    <TherapeuticClassTableRow
                      therapeuticClass={item ?? []}
                      key={item.id}
                    />
                  ))
                ) : (
                  <div>Nenhum estoque encontrado</div>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination />
        </div>
      </div>
    </>
  )
}
