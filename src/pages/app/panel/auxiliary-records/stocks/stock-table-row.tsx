import { PenLine, Search, Trash } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { UpdateStockDialog } from './update-stock-dialog'

export interface StockTableRowProps {
  stock: {
    id: string
    name: string
    status: boolean
    institutionName: string
  }
}

export function StockTableRow({ stock }: StockTableRowProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {stock.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2">
          {stock.status ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-muted-foreground">ATIVO</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="font-medium text-muted-foreground">INATIVO</span>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>{stock.institutionName}</TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateStockDialog open={isOpen} stockId={stock.id} />
        </Dialog>
      </TableCell>
      <TableCell>
        <Button variant={'outline'} size={'xs'}>
          <Trash className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
