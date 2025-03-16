import { OperatorRole } from '@/api/pharma/operators/register-operator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/authContext'

interface SelectRoleProps {
  value?: OperatorRole
  onChange: (value: OperatorRole) => void
}

export function SelectRole({ value, onChange }: SelectRoleProps) {
  const { me } = useAuth()
  return (
    <Select value={value || ''} onValueChange={onChange}>
      {' '}
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o tipo de usuário" />
      </SelectTrigger>
      <SelectContent>
        {me?.role === 'MANAGER' ? (
          <>
            <SelectItem value="MANAGER">Administrador</SelectItem>
            <SelectItem value="COMMON">Comum</SelectItem>
          </>
        ) : (
          <></>
        )}

        {me?.role === 'SUPER_ADMIN' ? (
          <>
            <SelectItem value="SUPER_ADMIN">Super Usuário</SelectItem>
            <SelectItem value="MANAGER">Administrador</SelectItem>
            <SelectItem value="COMMON">Comum</SelectItem>
          </>
        ) : (
          <></>
        )}
      </SelectContent>
    </Select>
  )
}
