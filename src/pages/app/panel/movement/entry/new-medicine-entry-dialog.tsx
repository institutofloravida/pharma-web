import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format, isValid, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchManufacturers } from '@/api/auxiliary-records/manufacturer/fetch-manufacturer'
import { fetchPharmaceuticalForms } from '@/api/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { fetchStocks } from '@/api/auxiliary-records/stock/fetch-stocks'
import { fetchUnitsMeasure } from '@/api/auxiliary-records/unit-measure/fetch-units-measure'
import {
  fetchMedicinesVariants,
  type FetchMedicinesVariantsResponse,
} from '@/api/medicines-variants/fetch-medicines-variants'
import {
  registerMedicineEntry,
  type RegisterMedicineEntryBodyAndParams,
} from '@/api/movement/entry/register-medicine-entry'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { Combobox } from '@/components/comboboxes/pharmaceutical-form-combobox'
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
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  stockId: z.string({
    required_error: 'Selecione um estoque.',
  }),
  medicineVariantId: z.string({
    required_error: 'Selecione uma variante de medicamento.',
  }),
  newBatches: z.object({
    code: z
      .string({
        required_error: 'Digite um código',
      })
      .optional(),

    expirationDate: z.date({
      required_error: 'Selecione uma data válida',
    }),
    manufacturerId: z.string({
      required_error: 'Selecione uma fabricante',
    }),
    manufacturingDate: z.date().optional(),
    quantityToEntry: z.coerce.number().int(),
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
  const { token } = useAuth()

  const { mutateAsync: registerMedicineEntryFn } = useMutation({
    mutationFn: (data: RegisterMedicineEntryBodyAndParams) =>
      registerMedicineEntry(data, token ?? ''),
    onSuccess(
      _,
      {
        entryDate,
        medicineVariantId,
        movementTypeId,
        stockId,
        batches,
        newBatches,
      },
    ) {
      const cached = queryClient.getQueryData<FetchMedicinesVariantsResponse>([
        'medicines-variants',
        1,
      ]) || { medicines_variants: [], meta: { page: 1, totalCount: 0 } }

      const medicineName = queryMedicine
      const unitMeasureAcronym = queryUnitMeasure
      const pharmaceuticalFormName = queryPharmaceuticalForm

      if (cached.medicines_variants) {
        const updatedData = {
          ...cached,
          medicines_variants: [{}, ...cached.medicines_variants],
          meta: {
            ...cached.meta,
            totalCount: cached.meta.totalCount + 1,
          },
        }

        queryClient.setQueryData(['medicines-variants', 1], updatedData)
      }
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

  const { data: unitsMeasureResult, isFetching: isFetchingUnitsMeasure } =
    useQuery({
      queryKey: ['units-measure', queryUnitMeasure],
      queryFn: () =>
        fetchUnitsMeasure({ page: 1, query: queryUnitMeasure }, token ?? ''),
      enabled: queryUnitMeasure !== null,
      staleTime: 1000,
      refetchOnMount: true,
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // await registerMedicineEntryFn({
      //   medicineId: data.medicineVariantId,
      //   pharmaceuticalFormId: data.pharmaceuticalFormId,
      //   unitMeasureId: data.unitMeasureId,
      //   dosage: data.dosage,
      // })

      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error: any) {
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            {error.message}
          </pre>
        ),
      })
    }
  }

  return (
    <DialogContent className="flex flex-col items-center">
      <DialogHeader className="items-center">
        <DialogTitle>Nova Entrada</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar uma nova entrada de medicamento.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-5">
          <FormField
            control={form.control}
            name="stockId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
              <FormItem className="flex flex-col">
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
              <FormItem className="flex flex-col">
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
            name="newBatches.code"
            render={({ field }) => (
              <FormItem>
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
            name="newBatches.manufacturingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Fabricação</FormLabel>
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
          <FormField
            control={form.control}
            name="newBatches.expirationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Validade</FormLabel>
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
            name="newBatches.quantityToEntry"
            render={({ field }) => (
              <FormItem>
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

          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'ghost'}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}