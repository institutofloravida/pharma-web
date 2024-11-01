import { Search, UserMinus, UserPen } from 'lucide-react'

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
  operator: {
    id: string
    name: string
    email: string
    role: string
  }
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
      <TableCell>UBS - módulo 32</TableCell>
      <TableCell className="font-medium">
        <Select defaultValue={operator.role}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrador</SelectItem>
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
