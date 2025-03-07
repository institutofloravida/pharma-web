import { PenLine, Search, UserMinus, UserPen } from 'lucide-react'
import { useState } from 'react'

import { Operator } from '@/api/pharma/operators/fetch-operators'
import { OperatorRole } from '@/api/pharma/operators/register-operator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { getOperatorRoleTranslation } from '@/lib/utils/translations-mappers/operator-role-translation'

import { UpdateOperatorDialog } from './update-operator-dialog'

export interface OperatorTableRowProps {
  operator: Operator
}

export function OperatorTableRow({ operator }: OperatorTableRowProps) {
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
        {operator.name}
      </TableCell>
      <TableCell className="text-muted-foreground">{operator.email}</TableCell>
      <TableCell className="flex-grow flex-col flex-wrap space-x-1 space-y-1">
        {operator.institutions.map((institution, index) => {
          if (index > 1) {
            return <></>
          }
          return (
            <Badge key={institution.id} variant={'outline'}>
              {institution.name}
            </Badge>
          )
        })}
        {operator.institutions.length > 2 && (
          <Badge variant={'outline'}>...</Badge>
        )}
      </TableCell>
      <TableCell className="font-medium">
        <Badge variant={'secondary'}>
          {getOperatorRoleTranslation(OperatorRole[operator.role])}
        </Badge>
      </TableCell>
      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateOperatorDialog open={isOpen} operatorId={operator.id} />
        </Dialog>
      </TableCell>
      <TableCell>
        <Button variant={'outline'} size={'xs'}>
          <UserMinus className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
