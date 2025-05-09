import { PenLine, Search, Trash } from 'lucide-react'

import { MedicineExit } from '@/api/pharma/movement/exit/fetch-medicines-exits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { dateFormatter } from '@/lib/utils/formatter'

export interface MedicinesExitsTableRowProps {
  medicineExit: MedicineExit
}

export function MedicineExitTableRow({
  medicineExit,
}: MedicinesExitsTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da saída</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.stock}
      </TableCell>
      <TableCell className="items-center space-x-2 font-mono text-xs font-medium">
        <Badge>{medicineExit.medicine}</Badge>
        <Badge variant={'secondary'}>
          {medicineExit.dosage}
          {medicineExit.unitMeasure}
        </Badge>
        <Badge variant={'outline'} className="">
          {medicineExit.pharmaceuticalForm}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <Badge variant={'outline'} className="">
          {medicineExit.batch}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.quantity}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.movementType}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.operator}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(medicineExit.createdAt))}
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
