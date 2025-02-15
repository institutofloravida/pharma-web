import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const pharmaceuticalFormsFiltersSchema = z.object({
  query: z.string().optional(),
})

type PharmaceuticalFormsFiltersSchema = z.infer<
  typeof pharmaceuticalFormsFiltersSchema
>

export function PharmaceuticalFormTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('query')

  const form = useForm<PharmaceuticalFormsFiltersSchema>({
    resolver: zodResolver(pharmaceuticalFormsFiltersSchema),
    defaultValues: {
      query: query ?? '',
    },
  })

  function hanldeFilter({ query }: PharmaceuticalFormsFiltersSchema) {
    setSearchParams((state) => {
      if (query) {
        state.set('query', query)
      } else {
        state.delete('query')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('query')
      state.set('page', '1')

      return state
    })

    form.reset({
      query: '',
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-2"
        onSubmit={form.handleSubmit(hanldeFilter)}
      >
        <span className="text-sm font-semibold">Filtros:</span>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="h-8 w-auto">
              <FormControl>
                <Input placeholder="Nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant={'secondary'} size={'xs'}>
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          onClick={handleClearFilters}
          type="button"
          variant={'outline'}
          size={'xs'}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
      </form>
    </Form>
  )
}
