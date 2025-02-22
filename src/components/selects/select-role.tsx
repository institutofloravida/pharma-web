import { OperatorRole } from '@/api/pharma/operators/register-operator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectRoleProps {
  value?: OperatorRole
  onChange: (value: OperatorRole) => void
}

export function SelectRole({ value, onChange }: SelectRoleProps) {
  return (
    <Select value={value || ''} onValueChange={onChange}>
      {' '}
      {/* Usando '' como fallback */}
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o tipo de usuário" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="SUPER_ADMIN">Super Administrador</SelectItem>
        <SelectItem value="MANAGER">Administrador</SelectItem>
        <SelectItem value="COMMON">Comum</SelectItem>
      </SelectContent>
    </Select>
  )
}
