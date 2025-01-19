import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Race } from '@/lib/utils/race'

interface SelectRaceProps {
  value: Race
  onChange: (value: Race) => void
}

export function SelectRace({ value, onChange }: SelectRaceProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione uma cor/raça" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Race.MIXED}>Parda</SelectItem>
        <SelectItem value={Race.BLACK}>Preta</SelectItem>
        <SelectItem value={Race.WHITE}>Branca</SelectItem>
        <SelectItem value={Race.YELLOW}>Amarela</SelectItem>
        <SelectItem value={Race.INDIGENOUS}>Indígena</SelectItem>
        <SelectItem value={Race.UNDECLARED}>Não declarada</SelectItem>
      </SelectContent>
    </Select>
  )
}
