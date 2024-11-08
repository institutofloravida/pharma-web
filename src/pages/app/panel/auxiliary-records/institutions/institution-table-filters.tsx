import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function InstitutionTableFilters() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="Nome do operador" className="h-8 w-[320px]" />
      <Select>
        <SelectTrigger className="h-8 w-[240px]">
          <SelectValue placeholder="Selecione uma Instituição" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="pending">Instituto Flora Vida</SelectItem>
          <SelectItem value="canceled">UBS - módulo 32</SelectItem>
          <SelectItem value="canceled">UBS - módulo 15</SelectItem>
          <SelectItem value="delivering">Clínica Meliuz</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" variant={'secondary'} size={'xs'}>
        <Search className="mr-2 h-4 w-4" />
        Filtrar Resultados
      </Button>
      <Button type="button" variant={'outline'} size={'xs'}>
        <X className="mr-2 h-4 w-4" />
        Remover Filtros
      </Button>
    </form>
  )
}
