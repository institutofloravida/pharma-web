import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/fetch-institutions'
import { SelectInstitutions } from '@/components/select-institutions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/authContext'

export function StockTableFilters() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: institutions } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => fetchInstitutions({ page }, token ?? ''),
  })

  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="Nome do operador" className="h-8 w-[320px]" />
      <SelectInstitutions institutions={institutions ?? []} />
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
