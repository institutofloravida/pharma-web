import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import { SelectInstitutions } from '@/components/selects/select-institutions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContext'

const FormSchema = z.object({
  name: z.string().optional(),
  institutionId: z.string(),
})
export function MedicineVariantTableFilters() {
  const { token } = useAuth()

  const [searchParams, _] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: institutionsResult } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => fetchInstitutions({ page }, token ?? ''),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function handleSubmit() {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-2/3 flex-1 items-center gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="items-center">
              <FormControl>
                <Input placeholder="Nome do Medicamento..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institutionId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectInstitutions
                  institutions={institutionsResult?.institutions ?? []}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" variant={'secondary'} size={'xs'}>
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button type="button" variant={'outline'} size={'xs'}>
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
      </form>
    </Form>
  )
}
