import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchStocks } from '@/api/auxiliary-records/stock/fetch-stocks'
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

import { NewStockDialog } from './new-stock-dialog'
import { StockTableFilters } from './stock-table-filters'
import { StockTableRow } from './stock-table-row'

export function Stocks() {
  const { token } = useAuth()
  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: stocksResult } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => fetchStocks({ page }, token ?? ''),
  })

  return (
    <>
      <Helmet title="Estoques" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Estoques</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <StockTableFilters />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={'default'}>Novo Estoque</Button>
              </DialogTrigger>
              <NewStockDialog />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[550px]">Instituição</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocksResult?.stocks ? (
                  stocksResult.stocks.map((item) => (
                    <StockTableRow stock={item} key={item.id} />
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
