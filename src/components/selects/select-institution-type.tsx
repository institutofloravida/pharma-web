import { InstitutionType } from '@/api/pharma/auxiliary-records/institution/register-institution'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectInstitutionTypeProps {
  value: InstitutionType
  onChange: (value: InstitutionType) => void
}

export function SelectInstitutionType({
  value,
  onChange,
}: SelectInstitutionTypeProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um tipo de instituição" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={InstitutionType.PUBLIC}>Pública</SelectItem>
        <SelectItem value={InstitutionType.PRIVATE}>Privada</SelectItem>
        <SelectItem value={InstitutionType.ONG}>ONG</SelectItem>
      </SelectContent>
    </Select>
  )
}
