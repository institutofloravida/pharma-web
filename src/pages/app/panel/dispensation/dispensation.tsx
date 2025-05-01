import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchDispensations } from '@/api/pharma/dispensation/fetch-dispensations'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'

import { DispensationTableFilters } from './dispensation-table-filters'
import { DispensationTableRow } from './dispensation-table-row'

export function Dispensations() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const patientId = searchParams.get('patientId')
  const dispensationDate = searchParams.get('dispensationDate')

  const { data: dispensationsResult } = useQuery({
    queryKey: ['dispensations', patientId, dispensationDate],
    queryFn: () =>
      fetchDispensations(
        {
          page,
          patientId,
          dispensationDate: dispensationDate
            ? new Date(dispensationDate)
            : undefined,
        },
        token ?? '',
      ),
  })
  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Dispensas de Medicamentos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Dispensas de Medicamentos
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <DispensationTableFilters />
            <Button
              className=""
              variant={'default'}
              onClick={() => navigate('/dispensation/new')}
            >
              Nova dispensa
            </Button>
            {/* <NewUserDialog /> */}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead className="w-[180px]">Dispensado em</TableHead>
                  <TableHead className="w-[180px]">Items</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispensationsResult &&
                  dispensationsResult.dispensations.map((dispensation) => {
                    return (
                      <DispensationTableRow
                        dispensation={dispensation}
                        key={dispensation.id}
                      />
                    )
                  })}
              </TableBody>
            </Table>
          </div>

          {dispensationsResult && (
            <Pagination
              pageIndex={dispensationsResult.meta.page}
              totalCount={dispensationsResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
