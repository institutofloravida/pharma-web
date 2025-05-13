import { formatters } from 'date-fns'
import { PenLine, Search, Trash } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Formatter } from '@/lib/utils/formaters/formaters'

import { UpdateInstitutionDialog } from './update-instituion-dialog'

export interface InstitutionTableRowProps {
  institution: {
    id: string
    name: string
    cnpj: string
    description: string
  }
}

export function InstitutionTableRow({ institution }: InstitutionTableRowProps) {
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
        {institution.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {Formatter.cnpj(institution.cnpj)}
      </TableCell>
      <TableCell>{institution.description}</TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateInstitutionDialog
            open={isOpen}
            institutionId={institution.id}
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
