import { ArrowDown, ArrowUp, PenLine, Search, Trash } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  getMovementTypeTranslation,
  MovementTypeDirection,
} from '@/lib/utils/movement-type'

export interface MovementTypeTableRowProps {
  movementType: {
    name: string
    direction: MovementTypeDirection
  }
}

export function MovementTypeTableRow({
  movementType,
}: MovementTypeTableRowProps) {
  return (
    <TableRow className="">
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
        {movementType.name}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge
            className={
              movementType.direction === 'ENTRY'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20'
                : 'bg-rose-500/10 dark:bg-rose-500/20'
            }
          >
            {movementType.direction ===
            MovementTypeDirection.ENTRY.toString() ? (
              <ArrowUp
                size={15}
                className={
                  movementType.direction ===
                  MovementTypeDirection.ENTRY.toString()
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : 'text-rose-600 dark:text-rose-700'
                }
              />
            ) : (
              <ArrowDown
                size={15}
                className={
                  movementType.direction ===
                  MovementTypeDirection.ENTRY.toString()
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : 'text-rose-600 dark:text-rose-700'
                }
              />
            )}

            <p
              className={
                movementType.direction ===
                MovementTypeDirection.ENTRY.toString()
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-rose-700 dark:text-rose-600'
              }
            >
              {getMovementTypeTranslation(movementType.direction)}
            </p>
          </Badge>
        </div>
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
