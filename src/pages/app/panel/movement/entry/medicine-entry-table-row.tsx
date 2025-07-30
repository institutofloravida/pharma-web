import { PenLine, Search, Trash } from 'lucide-react'

import type { MedicineEntry } from '@/api/pharma/movement/entry/fetch-medicines-entries'
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

      <TableCell className="font-mono text-xs font-medium">
        {medicineEntry.operator}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineEntry.items}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(medicineEntry.entryDate))}
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
