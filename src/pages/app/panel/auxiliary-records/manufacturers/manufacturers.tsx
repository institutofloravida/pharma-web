import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchManufacturers } from '@/api/auxiliary-records/manufacturer/fetch-manufacturer'
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

import { ManufacturerTableFilters } from './manufacturer-table-filters'
import { ManufacturerTableRow } from './manufacturer-table-row'
import { NewManufacturerDialog } from './new-manufacturer-dialog'

export function Manufacturers() {
  const { token } = useAuth()

  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: manufacturers } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: () => fetchManufacturers({ page }, token ?? ''),
  })

  

  return (
    <>
      <Helmet title="Fabricantes" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Fabricantes</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <ManufacturerTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Novo Fabricante
                </Button>
              </DialogTrigger>
              <NewManufacturerDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">CNPJ</TableHead>
                  <TableHead className="w-[550px]">Descrição</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturers &&
                  manufacturers.map((item) => {
                    return (
                      <ManufacturerTableRow manufacturer={item} key={item.id} />
                    )
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
