import { PenLine, Search, Trash } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Formatter } from '@/lib/utils/formaters/formaters'

import { UpdateManufacturerDialog } from './update-manufacturer-dialog'

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
        {manufacturer.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {Formatter.cnpj(manufacturer.cnpj)}
      </TableCell>
      <TableCell>{manufacturer.description}</TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateManufacturerDialog
            open={isOpen}
            manufacturerId={manufacturer.id}
          />
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
