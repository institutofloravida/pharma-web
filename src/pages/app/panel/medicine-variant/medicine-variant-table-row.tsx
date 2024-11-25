import { PenLine, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

export interface MedicinesVariantsTableRowProps {
  medicineVariant: {
    id: string
    medicine: string
    dosage: string
    unitMeasure: string
    pharmaceuticalForm: string
  }
}

export function MedicineVariantTableRow({
  medicineVariant,
}: MedicinesVariantsTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da variante</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineVariant.medicine}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineVariant.dosage} {medicineVariant.unitMeasure}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineVariant.pharmaceuticalForm}
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
