import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { MovementTypeDirection } from '@/lib/utils/movement-type'

interface SelectDirectionProps {
  value?: MovementTypeDirection
  onChange: (value: MovementTypeDirection) => void
}

export function SelectDirection({ value, onChange }: SelectDirectionProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Direção..." />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value={MovementTypeDirection.ENTRY}>Entrada</SelectItem>
        <SelectItem value={MovementTypeDirection.EXIT}>Saída</SelectItem>
      </SelectContent>
    </Select>
  )
}
