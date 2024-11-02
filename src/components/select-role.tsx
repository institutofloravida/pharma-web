import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectRoleProps {
  value: 'ADMIN' | 'COMMON'
  onChange: (value: 'ADMIN' | 'COMMON') => void
}

export function SelectRole({ value, onChange }: SelectRoleProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o tipo de usuário" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Administrador</SelectItem>
        <SelectItem value="COMMON">Comum</SelectItem>
      </SelectContent>
    </Select>
  )
}
