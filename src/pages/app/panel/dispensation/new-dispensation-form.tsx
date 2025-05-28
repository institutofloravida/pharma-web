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
import { dispensationPreview } from '@/api/pharma/dispensation/dispensation-preview'
import {
  registerDispensation,
  type RegisterDispensationBody,
} from '@/api/pharma/dispensation/register-dispensation'
import { fetchBatchesOnStock } from '@/api/pharma/stock/bacth-stock/fetch-batches-stock'
import {
  fetchMedicinesOnStock,
  type MedicineStockDetails,
} from '@/api/pharma/stock/medicine-stock/fetch-medicines-stock'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  quantityToDispensation: z
    .number({ required_error: 'Campo obrigatório' })
    .min(1, 'A quantidade deve ser pelo menos 1.'),
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
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineStockDetails | null>(null)

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

  const {
    data: dispensationPreviewResult,
    isFetching: isFetchingDispensationPreview,
    refetch: refetchDispensationPreview,
  } = useQuery({
    queryKey: ['dispensation-preview'],
    queryFn: () => {
      const medicineStockId = form.getValues('medicineStockId')
      const quantityRequired = form.getValues('quantityToDispensation')
      return dispensationPreview(
        { medicineStockId, quantityRequired },
        token ?? '',
      )
    },
    enabled: false,
    staleTime: 1000,
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
    try {
      if (activeTab === 'patient') {
        const isValid = await form.trigger(['patientId', 'dispensationDate'])
        if (isValid) {
          setActiveTab('medicine')
        }
      } else if (activeTab === 'medicine') {
        const isValid = await form.trigger([
          'stockId',
          'medicineStockId',
          'quantityToDispensation',
        ])

        if (isValid) {
          const quantity = Number(form.getValues('quantityToDispensation'))
          const availableQuantity = Number(
            selectedMedicine?.quantity.available ?? 0,
          )

          if (quantity <= 0) {
            form.setError('quantityToDispensation', {
              type: 'manual',
              message: 'A quantidade deve ser maior que zero',
            })
            return
          }

          if (quantity > availableQuantity) {
            form.setError('quantityToDispensation', {
              type: 'manual',
              message: `Quantidade indisponível. Estoque: ${availableQuantity}`,
            })
            return
          }

          const previewResponse = await refetchDispensationPreview()
          const batches = previewResponse.data ?? []

          form.setValue(
            'batchesStocks',
            batches.map((batch) => ({
              batchStockId: batch.batchStockId,
              quantity: batch.quantity.toDispensation,
            })),
          )

          setActiveTab('batches')
        }
      }
    } catch (error) {
      console.error('Erro ao avançar:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar avançar',
        variant: 'destructive',
      })
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
      const availableQuantity = Number(
        selectedMedicine?.quantity.available ?? 0,
      )
      const requestedQuantity = Number(data.quantityToDispensation)

      if (requestedQuantity > availableQuantity) {
        toast({
          title: 'Erro na dispensa',
          description: 'A quantidade solicitada excede o estoque disponível',
          variant: 'destructive',
        })
        return
      }
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
                      `${Formatter.cpf(item.cpf ?? '')} - ${item.name} - ${dateFormatter.format(new Date(item.birthDate))}`
                    }
                    getItemText={(item) =>
                      `${Formatter.cpf(item.cpf ?? '')} - ${item.name} - ${dateFormatter.format(new Date(item.birthDate))}`
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
                          type="button"
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
              <Button type="button" onClick={handleNext}>
                Próximo
              </Button>
            </div>
          </TabsContent>
          <TabsContent
            value="medicine"
            className="grid w-full grid-cols-6 gap-2 space-y-2 pl-2"
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
                    getItemText={(item) => {
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
                <FormItem className="col-span-6 flex flex-col">
                  <FormLabel>Medicamento</FormLabel>
                  <ComboboxUp
                    items={medicinesStockResult?.medicines_stock ?? []}
                    field={field}
                    query={queryMedicineStock}
                    placeholder="Selecione um medicamento"
                    isFetching={isFetchingMedicinesStock}
                    onQueryChange={setQueryMedicineStock}
                    onSelect={(id, item) => {
                      form.setValue('medicineStockId', id)
                      form.setValue('quantityToDispensation', 0)
                      setSelectedMedicine(item)
                    }}
                    itemKey="id"
                    getItemText={(item) =>
                      `${item.medicine} ${item.pharmaceuticalForm} ${item.unitMeasure}`
                    }
                    formatItem={(item) => (
                      <div className="flex gap-2">
                        <span>
                          {item.medicine} - {item.pharmaceuticalForm} -{' '}
                          {item.dosage}
                          {item.unitMeasure}
                        </span>
                        <div className="text-sm">
                          <span className="text-green-600">
                            {item.quantity.available} disp.
                          </span>
                          {item.quantity.unavailable > 0 && (
                            <span className="ml-2 text-red-500">
                              {item.quantity.unavailable} indis.
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  {selectedMedicine &&
                    selectedMedicine.quantity.available <= 0 && (
                      <FormDescription>
                        Não existem quantidades válidas para este medicamento
                      </FormDescription>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`quantityToDispensation`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      disabled={
                        !selectedMedicine ||
                        selectedMedicine.quantity.available <= 0
                      }
                      {...field}
                      type="number"
                      max={selectedMedicine?.quantity.available || undefined}
                      placeholder="Quantidade"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-6 grid justify-end">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className=""
                  onClick={handlePrevious}
                >
                  Voltar
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    !selectedMedicine ||
                    selectedMedicine.quantity.available <= 0 ||
                    isFetchingDispensationPreview
                  }
                >
                  Próximo
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="batches"
            className="grid w-full max-w-[400px] gap-2 space-y-2 pl-2"
          >
            <div className="col-span-6 grid justify-end">
              {dispensationPreviewResult ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lote</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead className="w-[180px]">
                          Quantidade p/ Disp.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dispensationPreviewResult?.map((batch, index) => (
                        <TableRow key={batch.batchStockId}>
                          {/* Lote (código) */}
                          <TableCell className="font-mono text-xs font-medium">
                            {batch.code}
                          </TableCell>

                          {/* Data de validade */}
                          <TableCell className="font-mono text-xs font-medium">
                            {dateFormatter.format(
                              new Date(batch.expirationDate),
                            )}
                          </TableCell>

                          <TableCell className="font-mono text-xs font-medium">
                            {batch.quantity.totalCurrent}
                          </TableCell>

                          {/* Input de quantidade */}
                          <TableCell className="font-mono text-xs font-medium">
                            <input
                              type="hidden"
                              {...form.register(
                                `batchesStocks.${index}.batchStockId`,
                              )}
                              value={batch.batchStockId}
                            />

                            <FormField
                              control={form.control}
                              name={`batchesStocks.${index}.quantity`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    className="w-24"
                                    value={
                                      field.value ??
                                      batch.quantity.toDispensation
                                    }
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                // dispensationPreviewResult.map((batch, index) => (
                //   <div key={batch.batchStockId}>
                //     <input
                //       type="hidden"
                //       {...form.register(`batchesStocks.${index}.batchStockId`)}
                //       value={batch.batchStockId}
                //     />

                //     <FormField
                //       control={form.control}
                //       name={`batchesStocks.${index}.quantity`}
                //       render={({ field }) => (
                //         <FormItem className="col-span-2">
                //           <FormLabel>
                //             Lote {batch.code} — vence em{' '}
                //             {new Date(
                //               batch.expirationDate,
                //             ).toLocaleDateString()}
                //           </FormLabel>
                //           <FormControl>
                //             <Input
                //               {...field}
                //               type="number"
                //               value={field.value ?? batch.quantity} // valor inicial preenchido com a sugestão do preview
                //               onChange={(e) =>
                //                 field.onChange(Number(e.target.value))
                //               }
                //             />
                //           </FormControl>
                //           <FormMessage />
                //         </FormItem>
                //       )}
                //     />
                //   </div>
                // ))
                <>
                  <h1>nada</h1>
                </>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
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
