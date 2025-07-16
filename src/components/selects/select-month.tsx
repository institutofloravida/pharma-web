import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectMonthProps {
  value: string
  onChange: (value: string) => void
}

const MONTHS = [
  { id: '0', label: 'Janeiro' },
  { id: '1', label: 'Fevereiro' },
  { id: '2', label: 'Março' },
  { id: '3', label: 'Abril' },
  { id: '4', label: 'Maio' },
  { id: '5', label: 'Junho' },
  { id: '6', label: 'Julho' },
  { id: '7', label: 'Agosto' },
  { id: '8', label: 'Setembro' },
  { id: '9', label: 'Outubro' },
  { id: '10', label: 'Novembro' },
  { id: '11', label: 'Dezembro' },
]

export function SelectMonth({ value, onChange }: SelectMonthProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o mês" />
      </SelectTrigger>
      <SelectContent>
        {MONTHS.map((month) => (
          <SelectItem key={month.id} value={month.id}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
