import type { Institution } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
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
  isDisabled?: boolean
  onChange: (value: string) => void
}

export function SelectInstitutions({
  institutions,
  value,
  isDisabled = false,
  onChange,
}: SelectInstitutionsProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={isDisabled}>
      <SelectTrigger className="">
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
