import { ExitType } from '@/api/pharma/movement/exit/register-medicine-exit'
import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectExitTypeProps {
  value: ExitType
  onChange: (value: ExitType) => void
}

export function SelectExitType({ value, onChange }: SelectExitTypeProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um tipo de saída" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value={ExitType.EXPIRATION}>Vencimento</SelectItem>
        <SelectItem value={ExitType.MOVEMENT_TYPE}>Outro</SelectItem>
      </SelectContent>
    </Select>
  )
}
