import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchTherapeuticClasses } from '@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import { fetchMedicines } from '@/api/pharma/medicines/fetch-medicines'
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

import { MedicineTableFilters } from './medicine-table-filters'
import { MedicineTableRow } from './medicine-table-row'
import { NewMedicineDialog } from './new-medicine-dialog'

export function Medicines() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: medicinesResult } = useQuery({
    queryKey: ['medicines', pageIndex],
    queryFn: () => fetchMedicines({ page: pageIndex }, token ?? ''),
  })

  const { data: therapeuticClasses } = useQuery({
    queryKey: ['therapeutic-classes'],
    queryFn: () => fetchTherapeuticClasses({ page: 1 }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Medicamentos</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <MedicineTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Novo Medicamento
                </Button>
              </DialogTrigger>
              <NewMedicineDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="">Descrição</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesResult &&
                  medicinesResult.medicines.map((item) => {
                    return <MedicineTableRow medicine={item} key={item.id} />
                  })}
              </TableBody>
            </Table>
          </div>
          {medicinesResult && (
            <Pagination
              pageIndex={medicinesResult.meta.page}
              totalCount={medicinesResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
