import type { Gender } from '@/api/users/fetch-users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectGenderProps {
  value: Gender
  onChange: (value: Gender) => void
}

export function SelectGender({ value, onChange }: SelectGenderProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um gênero" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="M">Masculino</SelectItem>
        <SelectItem value="F">Feminino</SelectItem>
        <SelectItem value="O">Outros</SelectItem>
      </SelectContent>
    </Select>
  )
}
