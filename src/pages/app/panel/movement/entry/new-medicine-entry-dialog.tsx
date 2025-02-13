import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchManufacturers } from '@/api/pharma/auxiliary-records/manufacturer/fetch-manufacturer'
import { fetchMovementTypes } from '@/api/pharma/auxiliary-records/movement-type/fetch-movement-types'
import { fetchStocks } from '@/api/pharma/auxiliary-records/stock/fetch-stocks'
import { fetchUnitsMeasure } from '@/api/pharma/auxiliary-records/unit-measure/fetch-units-measure'
import {
  fetchMedicinesVariants,
  type FetchMedicinesVariantsResponse,
} from '@/api/pharma/medicines-variants/fetch-medicines-variants'
import {
  registerMedicineEntry,
  type RegisterMedicineEntryBodyAndParams,
} from '@/api/pharma/movement/entry/register-medicine-entry'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { handleApiError } from '@/lib/utils/handle-api-error'
import { MovementTypeDirection } from '@/lib/utils/movement-type'

const FormSchema = z.object({
  stockId: z.string({
    required_error: 'Selecione um estoque.',
  }),
  medicineVariantId: z.string({
    required_error: 'Selecione uma variante de medicamento.',
  }),
  movementTypeId: z.string({
    required_error: 'Selecione umtipo de movimentação.',
  }),
  newBatches: z.object({
    code: z.string({
      required_error: 'Digite um código',
    }),
    expirationDate: z.date({
      required_error: 'Selecione uma data válida',
    }),
    manufacturerId: z.string({
      required_error: 'Selecione uma fabricante',
    }),
    manufacturingDate: z.date().optional(),
    quantityToEntry: z.coerce.number().int(),
  }),
  entryDate: z.date({
    required_error: 'Selecione uma data válida',
  }),
})

// type NewMedicineVariantSchema = z.infer<typeof FormSchema>
// interface NewMedicineVariantDialogProps {
//   medicinesVariants: MedicineVariant[]
// }

export function NewMedicineEntryDialog() {
  const [queryMedicine, setQueryMedicine] = useState('')
  const [queryStock, setQueryStock] = useState('')
  const [queryPharmaceuticalForm, setQueryPharmaceuticalForm] = useState('')
  const [queryUnitMeasure, setQueryUnitMeasure] = useState('')
  const [queryMedicineVariant, setQueryMedicineVariant] = useState('')
  const [queryManufacturer, setQueryManufacturer] = useState('')
  const [queryMovementType, setQueryMovementType] = useState('')
  const { token } = useAuth()

  const { mutateAsync: registerMedicineEntryFn } = useMutation({
    mutationFn: (data: RegisterMedicineEntryBodyAndParams) =>
      registerMedicineEntry(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['medicines-entries'],
      })
    },
  })

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ['stocks', queryStock],
    queryFn: () => fetchStocks({ page: 1, query: queryStock }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const {
    data: medicinesVariantsResult,
    isFetching: isFetchingMedicinesVariants,
  } = useQuery({
    queryKey: ['medicines-variants', queryMedicineVariant],
    queryFn: () =>
      fetchMedicinesVariants(
        { page: 1, query: queryMedicineVariant },
        token ?? '',
      ),
    enabled: queryMedicineVariant !== null,
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: manufacturersResult, isFetching: isFetchingManufacturers } =
    useQuery({
      queryKey: ['manufacturers', queryManufacturer],
      queryFn: () =>
        fetchManufacturers({ page: 1, query: queryManufacturer }, token ?? ''),
      enabled: queryStock !== null,
      staleTime: 1000,
      refetchOnMount: true,
    })

  const { data: movementTypesResult, isFetching: isFetchingMovementTypes } =
    useQuery({
      queryKey: [
        'movement-types',
        queryMovementType,
        MovementTypeDirection.ENTRY,
      ],
      queryFn: () =>
        fetchMovementTypes(
          {
            page: 1,
            query: queryMovementType,
            direction: MovementTypeDirection.ENTRY,
          },
          token ?? '',
        ),
      enabled: queryStock !== null,
      staleTime: 1000,
      refetchOnMount: true,
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await registerMedicineEntryFn({
        medicineVariantId: data.medicineVariantId,
        stockId: data.stockId,
        entryDate: data.entryDate,
        newBatches: [
          {
            code: data.newBatches.code,
            expirationDate: data.newBatches.expirationDate,
            manufacturerId: data.newBatches.manufacturerId,
            manufacturingDate: data.newBatches.manufacturingDate,
            quantityToEntry: data.newBatches.quantityToEntry,
          },
        ],
        movementTypeId: data.movementTypeId,
      })

      toast({
        title: 'Entrada de Medicamento',
        description: 'Entrada Realizada comsucesso!',
      })
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao registrar entrada',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="flex max-w-[800px] flex-col items-center">
      <DialogHeader className="items-center">
        <DialogTitle>Nova Entrada</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar uma nova entrada de medicamento.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-[800px] grid-cols-6 space-x-2 space-y-2"
        >
          <FormField
            control={form.control}
            name="stockId"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col">
                <FormLabel>Stock</FormLabel>
                <ComboboxUp
                  items={stocksResult?.stocks ?? []}
                  field={field}
                  query={queryStock}
                  placeholder="Selecione um estoque"
                  isFetching={isFetchingStocks}
                  onQueryChange={setQueryStock}
                  onSelect={(id, _) => {
                    form.setValue('stockId', id)
                  }}
                  itemKey="id"
                  formatItem={(item) => {
                    return `${item.name} - ${item.status ? 'ATIVO' : 'INATIVO'}`
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicineVariantId"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col">
                <FormLabel>Variante</FormLabel>
                <ComboboxUp
                  items={medicinesVariantsResult?.medicines_variants ?? []}
                  field={field}
                  query={queryMedicineVariant}
                  placeholder="Selecione a variante"
                  isFetching={isFetchingMedicinesVariants}
                  onQueryChange={setQueryMedicineVariant}
                  onSelect={(id, _) => {
                    form.setValue('medicineVariantId', id)
                  }}
                  itemKey="id"
                  formatItem={(item) => {
                    return `${item.medicine} - ${item.dosage}${item.unitMeasure} - ${item.pharmaceuticalForm}`
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newBatches.manufacturerId"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Fabricante</FormLabel>
                <ComboboxUp
                  items={manufacturersResult?.manufacturers ?? []}
                  field={field}
                  query={queryManufacturer}
                  placeholder="Selecione a variante"
                  isFetching={isFetchingManufacturers}
                  onQueryChange={setQueryManufacturer}
                  onSelect={(id, _) => {
                    form.setValue('newBatches.manufacturerId', id)
                  }}
                  itemKey="id"
                  formatItem={(item) => {
                    return `${item.name} - ${item.cnpj}`
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="movementTypeId"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Tipo de Movimentação</FormLabel>
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
            name="newBatches.code"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código do lote" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newBatches.quantityToEntry"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={10000}
                    placeholder="quantidade do lote"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newBatches.manufacturingDate"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Data de Fabricação</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newBatches.expirationDate"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Data de Validade</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
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
                      disabled={(date) => date < new Date()}
                      lang="pt-BR"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entryDate"
            defaultValue={new Date()}
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Data de Entrada</FormLabel>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="col-span-6 grid justify-end">
            <div className="flex-gap-2">
              <DialogClose asChild>
                <Button variant={'ghost'}>Cancelar</Button>
              </DialogClose>
              <Button type="submit">Enviar</Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
