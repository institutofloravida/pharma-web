import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchMedicines } from '@/api/pharma/medicines/fetch-medicines'
import { Combobox } from '@/components/comboboxes/combobox'
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

const medicineVariantsFiltersSchema = z.object({
  name: z.string().optional(),
  medicineId: z.string().optional(),
})

type MedicineVariantsFiltersSchema = z.infer<
  typeof medicineVariantsFiltersSchema
>

export function MedicineVariantTableFilters() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()

  const [queryMedicine, setQueryMedicine] = useState('')

  const medicineId = searchParams.get('medicineId')
  const name = searchParams.get('name')

  const { data: medicinesResult, isFetching: isFetchingMedicines } = useQuery({
    queryKey: ['medicines', queryMedicine],
    queryFn: () =>
      fetchMedicines({ page: 1, query: queryMedicine }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const form = useForm<MedicineVariantsFiltersSchema>({
    resolver: zodResolver(medicineVariantsFiltersSchema),
    defaultValues: {
      name: name ?? '',
      medicineId: medicineId ?? '',
    },
  })

  function handleFilter({ medicineId, name }: MedicineVariantsFiltersSchema) {
    const newParams = new URLSearchParams(searchParams)

    if (name) {
      newParams.set('name', name)
    } else {
      newParams.delete('name')
    }

    if (medicineId) {
      newParams.set('medicineId', medicineId)
    } else {
      newParams.delete('medicineId')
    }

    newParams.set('page', '1')

    setSearchParams(newParams)
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('name')
      state.delete('medicineId')
      state.set('page', '1')

      return state
    })

    form.reset({
      name: '',
      medicineId: '',
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilter)}
        className="grid grid-cols-6 items-center space-x-2 space-y-1 p-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2 grid">
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
                field={{ value: field.value ?? '' }}
                query={queryMedicine}
                placeholder="Medicamento específico "
                isFetching={isFetchingMedicines}
                onQueryChange={setQueryMedicine}
                onSelect={(id, name) => {
                  form.setValue('medicineId', id)
                  setQueryMedicine(name)
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
