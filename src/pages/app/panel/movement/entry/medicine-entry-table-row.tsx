import { PenLine, Search, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { MedicineEntry } from '@/api/pharma/movement/entry/fetch-medicines-entries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
        <Button variant={'outline'} size={'xs'} asChild>
          <Link to={`/movement/entries/${medicineEntry.entryId}`}>
            <Search className="h-3 w-3" />
            <span className="sr-only">Detalhes da Entrada</span>
          </Link>
        </Button>
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
      
    </TableRow>
  )
}
