import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchPharmaceuticalForms } from '@/api/pharma/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
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

import { NewPharmaceuticalFormDialog } from './new-pharmaceutical-form-dialog'
import { PharmaceuticalFormTableFilters } from './pharmaceutical-form-table-filters'
import { PharmaceuticalFormTableRow } from './pharmaceutical-form-table-row'

export function PharmaceuticalForms() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const query = searchParams.get('query')

  const { data: pharmaceuticalformsResult } = useQuery({
    queryKey: ['pharmaceutical-forms', page, query],
    queryFn: () => fetchPharmaceuticalForms({ page, query }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Forma farmacêutica" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Formas Farmacêuticas
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <PharmaceuticalFormTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Nova Forma farmacêutica
                </Button>
              </DialogTrigger>
              <NewPharmaceuticalFormDialog />
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
                {pharmaceuticalformsResult?.pharmaceutical_forms &&
                  pharmaceuticalformsResult?.pharmaceutical_forms.map(
                    (item) => {
                      return (
                        <PharmaceuticalFormTableRow
                          pharmaceuticalForm={item}
                          key={item.id}
                        />
                      )
                    },
                  )}
              </TableBody>
            </Table>
          </div>

          {pharmaceuticalformsResult && (
            <Pagination
              pageIndex={pharmaceuticalformsResult.meta.page}
              totalCount={pharmaceuticalformsResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
