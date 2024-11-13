import { PenLine, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

export interface ManufacturerTableRowProps {
  manufacturer: {
    id: string
    name: string
    cnpj: string
    description?: string
  }
}

export function ManufacturerTableRow({
  manufacturer,
}: ManufacturerTableRowProps) {
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
        {manufacturer.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {manufacturer.cnpj}
      </TableCell>
      <TableCell>{manufacturer.description}</TableCell>

      <TableCell>
        <Button variant={'outline'} size={'xs'}>
          <PenLine className="h-3 w-3" />
        </Button>
      </TableCell>
      <TableCell>
        <Button variant={'outline'} size={'xs'}>
          <Trash className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
