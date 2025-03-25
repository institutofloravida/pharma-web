import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchMedicines } from '@/api/pharma/medicines/fetch-medicines'
import { Combobox } from '@/components/comboboxes/pharmaceutical-form-combobox'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContext'

const MedicineVariantsFiltersSchema = z.object({
  medicineId: z.string().optional(),
  query: z.string().optional(),
})

type MedicineVariantsFiltersSchema = z.infer<
  typeof MedicineVariantsFiltersSchema
>

export function MedicineVariantTableFilters() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const [queryMedicines, setQueryMedicines] = useState('')

  const query = searchParams.get('query')
  const medicineId = searchParams.get('medicineId')

  const { data: medicinesResult, isFetching: isFetchingMedicines } = useQuery({
    queryKey: ['medicines', queryMedicines],
    queryFn: () =>
      fetchMedicines({ page: 1, query: queryMedicines }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const form = useForm<MedicineVariantsFiltersSchema>({
    resolver: zodResolver(MedicineVariantsFiltersSchema),
    defaultValues: {
      medicineId: medicineId ?? '',
      query: query ?? '',
    },
  })

  function handleFilter({ medicineId, query }: MedicineVariantsFiltersSchema) {
    const newParams = new URLSearchParams(searchParams)

    if (medicineId) {
      newParams.set('medicineId', medicineId)
    } else {
      newParams.delete('medicineId')
    }
    if (query) {
      newParams.set('query', query)
    } else {
      newParams.delete('query')
    }

    newParams.set('page', '1')

    setSearchParams(newParams)
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('medicineId')
      state.delete('query')
      state.set('page', '1')

      return state
    })

    form.reset({
      medicineId: '',
      query: '',
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
          name="query"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <Input placeholder="Nome do Medicamento..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medicineId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <Combobox
                items={medicinesResult?.medicines || []}
                field={field}
                query={queryMedicines}
                placeholder="Selecione o medicamento "
                isFetching={isFetchingMedicines}
                onQueryChange={setQueryMedicines}
                onSelect={(id, name) => {
                  form.setValue('medicineId', id)
                  setQueryMedicines(name)
                }}
                itemKey="id"
                itemValue="name"
              />
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
      </form>
    </Form>
  )
}
