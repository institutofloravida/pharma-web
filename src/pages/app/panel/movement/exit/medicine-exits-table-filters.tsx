import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import { fetchMovementTypes } from '@/api/pharma/auxiliary-records/movement-type/fetch-movement-types'
import { fetchMedicines } from '@/api/pharma/medicines/fetch-medicines'
import { fetchOperators } from '@/api/pharma/operators/fetch-operators'
import { fetchBatches } from '@/api/pharma/stock/batch/fetch-batches'
import { Combobox } from '@/components/comboboxes/combobox'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { SelectInstitutions } from '@/components/selects/select-institutions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/authContext'
import { cn } from '@/lib/utils'
import { MovementTypeDirection } from '@/lib/utils/movement-type'
import { getOperatorRoleTranslation } from '@/lib/utils/translations-mappers/operator-role-translation'

const FormSchema = z.object({
  medicineId: z.string().optional(),
  operatorId: z.string().optional(),
  batch: z.string().optional(),
  batchName: z.string().optional(),
  movementTypeId: z.string().optional(),
  exitDate: z.date().optional(),
})

type ExitsFiltersSchema = z.infer<typeof FormSchema>

export function MedicineExitTableFilters() {
  const { token } = useAuth()
  const [queryMedicine, setQueryMedicine] = useState('')
  const [queryBatch, setQueryBatch] = useState('')
  const [queryUsers, setQueryUsers] = useState('')
  const [queryMovementType, setQueryMovementType] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const medicineId = searchParams.get('medicineId')
  const operatorId = searchParams.get('operatorId')
  const batch = searchParams.get('batch')
  const movementTypeId = searchParams.get('movementTypeId')
  const exitDate = searchParams.get('exitDate')

  const { data: institutionsResult } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => fetchInstitutions({ page }, token ?? ''),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const { data: medicinesResult, isFetching: isFetchingMedicines } = useQuery({
    queryKey: ['medicines', queryMedicine],
    queryFn: () =>
      fetchMedicines({ page: 1, query: queryMedicine }, token ?? ''),
    enabled: queryMedicine !== null,
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: batchesResult, isFetching: isFetchingBatches } = useQuery({
    queryKey: ['batches', queryBatch],
    queryFn: () => fetchBatches({ page: 1, query: queryMedicine }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: operatorsResult, isFetching: isFetchingOperators } = useQuery({
    queryKey: ['operators'],
    queryFn: () => fetchOperators({ page: 1 }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: movementTypesResult, isFetching: isFetchingMovementTypes } =
    useQuery({
      queryKey: [
        'movement-types',
        queryMovementType,
        MovementTypeDirection.EXIT,
      ],
      queryFn: () =>
        fetchMovementTypes(
          {
            page: 1,
            query: queryMovementType,
            direction: MovementTypeDirection.EXIT,
          },
          token ?? '',
        ),
      staleTime: 1000,
      refetchOnMount: true,
    })

  function handleFilter({
    batch,
    batchName,
    exitDate,
    medicineId,
    movementTypeId,
    operatorId,
  }: ExitsFiltersSchema) {
    const newParams = new URLSearchParams(searchParams)

    if (batch && batchName) {
      newParams.set('batch', batchName)
    } else {
      newParams.delete('batch')
    }

    if (exitDate) {
      newParams.set('exitDate', exitDate.toISOString())
    } else {
      newParams.delete('exitDate')
    }

    if (medicineId) {
      newParams.set('medicineId', medicineId)
    } else {
      newParams.delete('medicineId')
    }

    if (movementTypeId) {
      newParams.set('movementTypeId', movementTypeId)
    } else {
      newParams.delete('movementTypeId')
    }

    if (operatorId) {
      newParams.set('operatorId', operatorId)
    } else {
      newParams.delete('operatorId')
    }

    newParams.set('page', '1')

    setSearchParams(newParams)
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('batch')
      state.delete('operatorId')
      state.delete('exitDate')
      state.delete('medicineId')
      state.delete('movementTypeId')

      state.set('page', '1')

      return state
    })

    form.reset({
      batch: '',
      exitDate: undefined,
      medicineId: '',
      movementTypeId: '',
      operatorId: '',
    })
  }

  async function handleSubmit() {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilter)}
        className="grid w-2/3 flex-1 grid-cols-12 items-center gap-2"
      >
        <FormField
          control={form.control}
          name="medicineId"
          render={({ field }) => (
            <FormItem className="col-span-4 flex flex-col">
              <Combobox
                items={medicinesResult?.medicines || []}
                field={field}
                query={queryMedicine}
                placeholder="Selecione o medicamento "
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

        <FormField
          control={form.control}
          name="operatorId"
          render={({ field }) => (
            <FormItem className="col-span-8 flex flex-col gap-1">
              <ComboboxUp
                field={field}
                items={operatorsResult?.operators ?? []}
                itemKey="id"
                onQueryChange={setQueryUsers}
                query={queryUsers}
                isFetching={isFetchingOperators}
                formatItem={(item) =>
                  `${item.name ?? ''} - ${getOperatorRoleTranslation(item.role) ?? ''} - ${item.email ?? ''}`
                }
                getItemText={(item) =>
                  `${item.name ?? ''} - ${getOperatorRoleTranslation(item.role) ?? ''} - ${item.email ?? ''}`
                }
                placeholder="Pesquise por um Operador"
                onSelect={(id, item) => {
                  form.setValue('operatorId', id)
                  // form.setValue('operatorName', item.name)
                }}
              />
              {/* <FormDescription>
                Pesquise por cpf, nome ou data de nascimento{' '}
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem className="col-span-2 flex flex-col gap-1">
              <ComboboxUp
                field={field}
                items={batchesResult?.batches ?? []}
                itemKey="id"
                onQueryChange={setQueryBatch}
                query={queryBatch}
                isFetching={isFetchingBatches}
                formatItem={(item) => `${item.code ?? ''}`}
                getItemText={(item) => `${item.code ?? ''} `}
                placeholder="Pesquise por um Lote"
                onSelect={(id, item) => {
                  form.setValue('batch', id)
                  form.setValue('batchName', item.code)
                  // form.setValue('operatorName', item.name)
                }}
              />
              {/* <FormDescription>
                Pesquise por cpf, nome ou data de nascimento{' '}
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="movementTypeId"
          render={({ field }) => (
            <FormItem className="col-span-2 flex flex-col gap-1">
              <ComboboxUp
                items={movementTypesResult?.movement_types ?? []}
                field={field}
                query={queryMovementType}
                placeholder="Selecione um tipo"
                isFetching={isFetchingMovementTypes}
                onQueryChange={setQueryMovementType}
                onSelect={(id, _) => {
                  form.setValue('movementTypeId', id)
                }}
                itemKey="id"
                getItemText={(item) => {
                  return `${item.name}`
                }}
                formatItem={(item) => {
                  return `${item.name}`
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exitDate"
          render={({ field }) => (
            <FormItem className="col-span-3 flex flex-col gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    lang="pt-BR"
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="col-span-2"
          variant={'secondary'}
          size={'xs'}
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          type="button"
          className="col-span-2"
          variant={'outline'}
          onClick={handleClearFilters}
          size={'xs'}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
      </form>
    </Form>
  )
}
