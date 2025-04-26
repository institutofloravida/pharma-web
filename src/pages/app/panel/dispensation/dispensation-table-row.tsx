import { formatDate } from 'date-fns'
import { PenLine, Search, Trash } from 'lucide-react'

import { Dispensation } from '@/api/pharma/dispensation/fetch-dispensations'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { dateFormatter } from '@/lib/utils/formatter'

export interface DispensationsTableRowProps {
  dispensation: Dispensation
}

export function DispensationTableRow({
  dispensation,
}: DispensationsTableRowProps) {
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
        {dispensation.patient}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dispensation.operator}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(dispensation.dispensationDate))}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dispensation.items}
      </TableCell>

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
