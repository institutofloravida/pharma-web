import type { Institution } from '@/api/fetch-institutions'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectInstitutionsProps {
  institutions: Institution[]
  value: string | undefined
  onChange: (value: string) => void
}

export function SelectInstitutions({
  institutions,
  value,
  onChange,
}: SelectInstitutionsProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Selecione uma Instituição" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Instituições</SelectLabel>
          {institutions &&
            institutions.map((institution) => (
              <SelectItem key={institution.id} value={institution.id}>
                {institution.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
