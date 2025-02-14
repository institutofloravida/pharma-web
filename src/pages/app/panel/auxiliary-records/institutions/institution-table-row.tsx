import { PenLine, Search, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

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
        {institution.cnpj}
      </TableCell>
      <TableCell>{institution.description}</TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateInstitutionDialog institutionId={institution.id} />
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
