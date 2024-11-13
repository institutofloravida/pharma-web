import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchUnitsMeasure } from '@/api/auxiliary-records/unit-measure/fetch-units-measure'
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

import { NewUnitMeasureDialog } from './new-unit-measure-dialog'
import { UnitMeasureTableFilters } from './units-measure-table-filters'
import { UnitMeasureTableRow } from './units-measure-table-row'

export function UnitMeasure() {
  const { token } = useAuth()
  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: unitsMeasure } = useQuery({
    queryKey: ['units-measure'],
    queryFn: () => fetchUnitsMeasure({ page }, token ?? ''),
  })

  return (
    <>
      <Helmet title="Unidades de medida" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Unidades de Medida
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <UnitMeasureTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'default'}>Nova Unidade de medida</Button>
              </DialogTrigger>
              <NewUnitMeasureDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[180px]">Nome</TableHead>
                  <TableHead>Abreviação</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unitsMeasure?.length ? (
                  unitsMeasure.map((item) => (
                    <UnitMeasureTableRow
                      unitMeasure={item ?? []}
                      key={item.id}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center">
                    <p>Nenhuma Unidade de Medida encontrada</p>
                  </div>
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
