import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function PharmaceuticalFormTableFilters() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="Nome do operador" className="h-8 w-[320px]" />
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
