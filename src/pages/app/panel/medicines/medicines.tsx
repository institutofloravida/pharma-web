import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchMedicines } from '@/api/medicines/fetch-medicines'
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

import { MedicineTableFilters } from './medicine-table-filters'
import { MedicineTableRow } from './medicine-table-row'

export function Medicines() {
  const { token } = useAuth()

  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: medicines } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => fetchMedicines({ page }, token ?? ''),
  })

  console.log()

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
              {/* <NewMedicineDialog /> */}
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
                {medicines &&
                  medicines.map((item) => {
                    return <MedicineTableRow medicine={item} key={item.id} />
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
