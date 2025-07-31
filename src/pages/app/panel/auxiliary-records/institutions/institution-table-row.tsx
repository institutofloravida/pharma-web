import { formatters } from 'date-fns'
import { PenLine, Search, Trash } from 'lucide-react'
import { useState } from 'react'

import type { InstitutionType } from '@/api/pharma/auxiliary-records/institution/register-institution'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Formatter } from '@/lib/utils/formaters/formaters'
import { getInstitutionTypeTranslation } from '@/lib/utils/translations-mappers/institution-type-translation'

import { UpdateInstitutionDialog } from './update-instituion-dialog'

export interface InstitutionTableRowProps {
  institution: {
    id: string
    name: string
    cnpj: string
    description: string
    responsible: string
    type: InstitutionType
    controlStock: boolean
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
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {institution.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {Formatter.cnpj(institution.cnpj)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {institution.responsible}
      </TableCell>
      <TableCell className="font-mediumtext-muted-foreground font-mono text-xs">
        <Badge variant={'outline'} className="font-medium">
          {getInstitutionTypeTranslation(institution.type)}
        </Badge>
      </TableCell>

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
