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

export function OperatorTableRow() {
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
        Francisco silva Machado de Sousa
      </TableCell>
      <TableCell className="text-muted-foreground">
        Francisc34@gmail.com
      </TableCell>
      <TableCell>UBS - módulo 32</TableCell>
      <TableCell className="font-medium">
        <Select defaultValue="COMMON">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AMDIN">Administrador</SelectItem>
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
