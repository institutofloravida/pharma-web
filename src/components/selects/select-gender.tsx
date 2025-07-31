import type { Gender } from '@/api/pharma/users/fetch-users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

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
      <SelectContent
        className={cn(
          '... relative z-[100]', // z-[100] ou maior que o Dialo
        )}
      >
        <SelectItem value="M">Masculino</SelectItem>
        <SelectItem value="F">Feminino</SelectItem>
        <SelectItem value="O">Outros</SelectItem>
      </SelectContent>
    </Select>
  )
}
