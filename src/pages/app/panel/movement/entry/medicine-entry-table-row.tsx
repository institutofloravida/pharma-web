import { PenLine, Search, Trash } from 'lucide-react'

import type { MedicineEntry } from '@/api/movement/entry/fetch-medicines-entries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { dateFormatter } from '@/lib/utils/formatter'

export interface MedicinesVariantsTableRowProps {
  medicineEntry: MedicineEntry
}

export function MedicineEntryTableRow({
  medicineEntry,
}: MedicinesVariantsTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da Entrada</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineEntry.stock}
      </TableCell>
      <TableCell className="items-center space-x-2 font-mono text-xs font-medium">
        <Badge>{medicineEntry.medicine}</Badge>
        <Badge variant={'secondary'}>
          {medicineEntry.dosage}
          {medicineEntry.unitMeasure}
        </Badge>
        <Badge variant={'outline'} className="">
          {medicineEntry.pharmaceuticalForm}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <Badge variant={'outline'} className="">
          {medicineEntry.batch}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineEntry.quantityToEntry}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineEntry.operator}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(medicineEntry.createdAt))}
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
