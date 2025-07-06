import { Search, UserMinus, UserPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { User } from '@/api/pharma/users/fetch-users'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Formatter } from '@/lib/utils/formaters/formaters'
import { dateFormatter } from '@/lib/utils/formatter'
import { getRaceTranslation } from '@/lib/utils/race'

export interface UserTableRowProps {
  user: User
}

export function UserTableRow({ user }: UserTableRowProps) {
  const navigate = useNavigate()
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'xs'}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do Usuário</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {user.name}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {user.cpf ? Formatter.cpf(user.cpf) : '-------------'}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {user.sus}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {user.gender}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {getRaceTranslation(user.race)}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(user.birthDate))}
      </TableCell>

      <TableCell>
        <Button
          variant={'outline'}
          size={'xs'}
          onClick={() => navigate(`/users/edit/${user.id}`)}
        >
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
