import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchTherapeuticClasses } from '@/api/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import { fetchMedicinesVariants } from '@/api/medicines-variants/fetch-medicines-variants'
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

import { MedicineVariantTableFilters } from './medicine-variant-table-filters'
import { MedicineVariantTableRow } from './medicine-variant-table-row'
import { NewMedicineVariantDialog } from './new-medicine-variant-dialog'

export function MedicinesVariants() {
  const { token } = useAuth()

  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: medicinesVariants } = useQuery({
    queryKey: ['medicines-variants'],
    queryFn: () => fetchMedicinesVariants({ page }, token ?? ''),
  })

  // const { data: therapeuticClasses } = useQuery({
  //   queryKey: ['therapeutic-classes'],
  //   queryFn: () => fetchTherapeuticClasses({ page }, token ?? ''),
  // })

  console.log()

  return (
    <>
      <Helmet title="Variantes de Medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Variantes de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <MedicineVariantTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="" variant={'default'}>
                  Nova Variante
                </Button>
              </DialogTrigger>
              {/* <NewMedicineVariantDialog
                therapeuticClasses={therapeuticClasses ?? []}
              /> */}
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Medicamento</TableHead>
                  <TableHead className="">Dosagem</TableHead>
                  <TableHead className="">Forma Farmacêutica</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicinesVariants &&
                  medicinesVariants.map((item) => {
                    return (
                      <MedicineVariantTableRow
                        medicineVariant={item}
                        key={item.id}
                      />
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
