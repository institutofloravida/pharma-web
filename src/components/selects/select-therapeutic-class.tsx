import type { TherapeuticClass } from '@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectTherapeuticClassesProps {
  therapeuticClasses: TherapeuticClass[]
  value: string | undefined
  onChange: (value: string) => void
}

export function SelectTherapeuticClasses({
  therapeuticClasses,
  value,
  onChange,
}: SelectTherapeuticClassesProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Selecione uma Instituição" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Instituições</SelectLabel>
          {therapeuticClasses &&
            therapeuticClasses.map((therapeuticclass) => (
              <SelectItem key={therapeuticclass.id} value={therapeuticclass.id}>
                {therapeuticclass.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
