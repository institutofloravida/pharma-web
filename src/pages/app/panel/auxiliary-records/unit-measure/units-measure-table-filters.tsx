import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContext'

export function UnitMeasureTableFilters() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

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
