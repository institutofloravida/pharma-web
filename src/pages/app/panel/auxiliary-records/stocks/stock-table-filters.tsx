import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
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

const stocksFiltersSchema = z.object({
  name: z.string().optional(),
  institutionsIds: z.array(z.string()).default([]),
})

type StocksFiltersSchema = z.infer<typeof stocksFiltersSchema>

export function StockTableFilters() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const [queryInstitution, setQueryInstitution] = useState('')

  const name = searchParams.get('name')
  const institutionsIds = searchParams.get('institutionsIds')
    ? searchParams.get('institutionsIds')!.split(',')
    : []

  const { data: institutionsResult, isFetching: isFetchingInstitutions } =
    useQuery({
      queryKey: ['institutions', queryInstitution],
      queryFn: () =>
        fetchInstitutions({ page: 1, query: queryInstitution }, token ?? ''),
      staleTime: 1000,
      refetchOnMount: true,
    })

  const form = useForm<StocksFiltersSchema>({
    resolver: zodResolver(stocksFiltersSchema),
    defaultValues: {
      name: name ?? '',
      institutionsIds: institutionsIds ?? [],
    },
  })

  function handleFilter({ name, institutionsIds }: StocksFiltersSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }

      if (institutionsIds.length > 0) {
        state.set('institutionsIds', institutionsIds.join(','))
      } else {
        state.delete('institutionsIds')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('name')
      state.delete('institutionsIds')
      state.set('page', '1')

      return state
    })

    form.reset({
      name: '',
      institutionsIds: [],
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilter)}
        className="grid grid-cols-6 space-x-2 space-y-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormControl>
                <Input placeholder="Nome do estoque..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={'secondary'}
          size={'xs'}
          className="col-span-1"
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          className="col-span-1"
          type="button"
          onClick={handleClearFilters}
          variant={'outline'}
          size={'xs'}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
        <FormField
          control={form.control}
          name="institutionsIds"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <ComboboxMany
                field={{
                  value: (field.value ?? []).map((id) => {
                    const institution = institutionsResult?.institutions.find(
                      (inst) => inst.id === id,
                    )
                    return {
                      id,
                      value: institution ? institution.name : 'Carregando...',
                    }
                  }),
                }}
                items={institutionsResult?.institutions ?? []}
                itemKey="id"
                onChange={(selectedItems) =>
                  field.onChange(selectedItems.map((item) => item.id))
                }
                onQueryChange={setQueryInstitution}
                query={queryInstitution}
                isFetching={isFetchingInstitutions}
                formatItem={(item) => `${item.name}`}
                placeholder="Instituições"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
