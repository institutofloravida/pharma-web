import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { fetchStocks } from '@/api/pharma/auxiliary-records/stock/fetch-stocks'
import {
  registerDispensation,
  type RegisterDispensationBody,
} from '@/api/pharma/dispensation/register-dispensation'
import { fetchBatchesOnStock } from '@/api/pharma/stock/bacth-stock/fetch-batches-stock'
import { fetchMedicinesOnStock } from '@/api/pharma/stock/medicine-stock/fetch-medicines-stock'
import { fetchUsers } from '@/api/pharma/users/fetch-users'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { cn } from '@/lib/utils'
import { Formatter } from '@/lib/utils/formaters/formaters'
import { dateFormatter } from '@/lib/utils/formatter'
import { handleApiError } from '@/lib/utils/handle-api-error'

export const newDispensationSchema = z.object({
  medicineStockId: z.string({
    required_error: 'O medicamento é obrigatório.',
  }),
  stockId: z.string({
    required_error: 'O estoque é obrigatório.',
  }),
  patientId: z.string({
    required_error: 'O paciente é obrigatório.',
  }),
  batchesStocks: z
    .array(
      z.object({
        batchStockId: z.string({
          required_error: 'O lote é obrigatório.',
        }),
        quantity: z
          .number({
            required_error: 'A quantidade é obrigatória.',
          })
          .min(1, 'A quantidade deve ser pelo menos 1.'),
      }),
    )
    .min(1, 'Pelo menos um lote deve ser selecionado.'),
  dispensationDate: z.date({
    required_error: 'A data da dispensação é obrigatória.',
  }),
})

export type NewDispensationSchema = z.infer<typeof newDispensationSchema>

export function NewDispensationForm() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [queryUsers, setQueryUsers] = useState('')
  const [queryStock, setQueryStock] = useState('')
  const [queryMedicineStock, setQueryMedicineStock] = useState('')
  const [activeTab, setActiveTab] = useState('patient')

  const navigate = useNavigate()

  const form = useForm<z.infer<typeof newDispensationSchema>>({
    resolver: zodResolver(newDispensationSchema),
    defaultValues: {},
  })

  const { data: usersResult, isFetching: isFetchingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers({ page: 1 }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => fetchStocks({ page: 1 }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })
  const { data: medicinesStockResult, isFetching: isFetchingMedicinesStock } =
    useQuery({
      queryKey: ['medicines-stock', form.watch('stockId'), queryMedicineStock],
      queryFn: () =>
        fetchMedicinesOnStock(
          {
            page: 1,
            stockId: form.watch('stockId'),
            medicineName: queryMedicineStock,
          },
          token ?? '',
        ),
      staleTime: 1000,
      enabled: !!form.watch('stockId'),
      refetchOnMount: true,
    })

  const { data: batchesStockResult, isFetching: isFetchingBatchesStock } =
    useQuery({
      queryKey: ['batches-stock', form.watch('medicineStockId')],
      queryFn: () =>
        fetchBatchesOnStock(
          {
            page: 1,
            stockId: form.watch('stockId'),
            medicineStockId: form.watch('medicineStockId'),
          },
          token ?? '',
        ),
      staleTime: 1000,
      enabled: !!form.watch('medicineStockId'),
      refetchOnMount: true,
    })

  const {
    mutateAsync: registerDispensationFn,
    isPending: isPendingRegisterDispensation,
  } = useMutation({
    mutationFn: (data: RegisterDispensationBody) =>
      registerDispensation(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['dispensations'],
      })
    },
  })

  const handleNext = async () => {
    let isValid = false

    if (activeTab === 'patient') {
      isValid = await form.trigger(['patientId'])
    } else if (activeTab === 'medicine') {
      isValid = await form.trigger(['stockId', 'medicineStockId'])
    }

    if (isValid) {
      if (activeTab === 'patient') {
        setActiveTab('medicine')
      } else if (activeTab === 'medicine') {
        setActiveTab('batches')
      }
    } else {
      console.log('Por favor, preencha os campos obrigatórios.')
    }
  }
  const handlePrevious = () => {
    if (activeTab === 'batches') {
      setActiveTab('medicine')
    } else if (activeTab === 'medicine') {
      setActiveTab('patient')
    }
  }

  async function handleRegisterDispensation(data: NewDispensationSchema) {
    try {
      await registerDispensationFn({
        batchesStocks: data.batchesStocks,
        dispensationDate: data.dispensationDate,
        medicineStockId: data.medicineStockId,
        patientId: data.patientId,
      })
      toast({
        title: `Dispensa registrada com sucesso!`,
      })

      form.reset({
        batchesStocks: [],
        dispensationDate: new Date(),
        medicineStockId: '',
        patientId: '',
        stockId: '',
      })

      setActiveTab('patient')
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao registrar dispensa',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegisterDispensation)}
        className="grid w-full max-w-[800px]"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="patient"
        >
          <TabsList>
            <TabsTrigger
              value="patient"
              disabled={['medicine', 'batches'].includes(activeTab)}
            >
              Usuário
            </TabsTrigger>
            <TabsTrigger
              value="medicine"
              disabled={['patient', 'batches'].includes(activeTab)}
            >
              Medicamento
            </TabsTrigger>
            <TabsTrigger
              value="batches"
              disabled={['patient', 'medicine'].includes(activeTab)}
            >
              Lotes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="patient" className="grid w-full gap-2 space-y-2">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="col-span-3 flex flex-col gap-1">
                  <FormLabel>Usuário</FormLabel>
                  <ComboboxUp
                    field={field}
                    items={usersResult?.patients ?? []}
                    itemKey="id"
                    onQueryChange={setQueryUsers}
                    query={queryUsers}
                    isFetching={isFetchingUsers}
                    formatItem={(item) =>
                      `${Formatter.cpf(item.cpf)} - ${item.name} - ${dateFormatter.format(new Date(item.birthDate))}`
                    }
                    placeholder="Pesquise por um usuário"
                    onSelect={(item) => {
                      form.setValue('patientId', item)
                    }}
                  />
                  <FormDescription>
                    Pesquise por cpf, nome ou data de nascimento{' '}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dispensationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da dispensa</FormLabel>
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

            <div className="col-span-6 grid justify-end">
              <Button type="submit" onClick={handleNext}>
                Próximo
              </Button>
            </div>
          </TabsContent>
          <TabsContent
            value="medicine"
            className="grid w-full gap-2 space-y-2 pl-2"
          >
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
              name="medicineStockId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Medicamento</FormLabel>
                  <ComboboxUp
                    items={medicinesStockResult?.medicines_stock ?? []}
                    field={field}
                    query={queryMedicineStock}
                    placeholder="Selecione um medicamento"
                    isFetching={isFetchingMedicinesStock}
                    onQueryChange={setQueryMedicineStock}
                    onSelect={(id, _) => {
                      form.setValue('medicineStockId', id)
                    }}
                    itemKey="id"
                    formatItem={(item) => {
                      return `${item.medicine} - ${item.dosage}${item.unitMeasure} - ${item.pharmaceuticalForm} - [${item.quantity}] uni.`
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-6 grid justify-end">
              <div className="flex gap-2">
                <Button variant="ghost" className="" onClick={handlePrevious}>
                  Voltar
                </Button>

                <Button className="" onClick={handleNext}>
                  Próximo
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="batches"
            className="grid w-full max-w-[300px] gap-2 space-y-2 pl-2"
          >
            <div className="col-span-6 grid justify-end">
              {batchesStockResult?.batches_stock.map((batch, index) => (
                <>
                  <input
                    type="hidden"
                    {...form.register(`batchesStocks.${index}.batchStockId`)}
                    value={batch.id}
                  />
                  <FormField
                    key={batch.id}
                    control={form.control}
                    name={`batchesStocks.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Lote {batch.batch}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            max={batch.quantity}
                            placeholder="Quantidade"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ))}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={handlePrevious}
                >
                  Voltar
                </Button>

                <Button type="submit">Cadastrar</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
