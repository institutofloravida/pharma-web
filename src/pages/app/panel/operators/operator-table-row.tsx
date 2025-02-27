import { Search, UserMinus, UserPen } from 'lucide-react'

import { Operator } from '@/api/pharma/operators/fetch-operators'
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

export interface OperatorTableRowProps {
  operator: Operator
}

export function OperatorTableRow({ operator }: OperatorTableRowProps) {
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
        <Select defaultValue={operator.role}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUPER_ADMIN">Super Administrador</SelectItem>
            <SelectItem value="MANAGER">Administrador</SelectItem>
            <SelectItem value="COMMON">Comum</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button variant={'outline'} size={'xs'}>
          <UserPen className="h-3 w-3" />
        </Button>
      </TableCell>
      <TableCell>
        <Button variant={'outline'} size={'xs'}>
          <UserMinus className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
