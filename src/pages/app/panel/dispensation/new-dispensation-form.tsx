import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { fetchStocks } from '@/api/pharma/auxiliary-records/stock/fetch-stocks'
import {
  registerDispensation,
  type RegisterDispensationBody,
} from '@/api/pharma/dispensation/register-dispensation'
import { fetchMedicinesVariants } from '@/api/pharma/medicines-variants/fetch-medicines-variants'
import { fetchUsers } from '@/api/pharma/users/fetch-users'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { Formatter } from '@/lib/utils/formaters/formaters'
import { dateFormatter } from '@/lib/utils/formatter'
import { handleApiError } from '@/lib/utils/handle-api-error'

export const newDispensationSchema = z.object({
  medicineVariantId: z.string({
    required_error: 'O medicamento é obrigatório.',
  }),
  stockId: z.string({
    required_error: 'O estoque é obrigatório.',
  }),
  patientId: z.string({
    required_error: 'O paciente é obrigatório.',
  }),
  // batchesStocks: z
  //   .array(
  //     z.object({
  //       batchStockId: z.string({
  //         required_error: 'O lote é obrigatório.',
  //       }),
  //       quantity: z
  //         .number({
  //           required_error: 'A quantidade é obrigatória.',
  //         })
  //         .min(1, 'A quantidade deve ser pelo menos 1.'),
  //     }),
  //   )
  //   .min(1, 'Pelo menos um lote deve ser selecionado.'),
  // dispensationDate: z.date({
  //   required_error: 'A data da dispensação é obrigatória.',
  // }),
})

export type NewDispensationSchema = z.infer<typeof newDispensationSchema>

export function NewDispensationForm() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [queryUsers, setQueryUsers] = useState('')
  const [queryStock, setQueryStock] = useState('')
  const [queryMedicineVariant, setQueryMedicineVariant] = useState('')
  const [activeTab, setActiveTab] = useState('patient')

  const navigate = useNavigate()

  const { data: usersResult, isFetching: isFetchingUsers } = useQuery({
    queryKey: ['states'],
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
  const {
    data: medicinesVariantsResult,
    isFetching: isFetchingMedicinesVariants,
  } = useQuery({
    queryKey: ['medicines-variants'],
    queryFn: () => fetchMedicinesVariants({ page: 1 }, token ?? ''),
    staleTime: 1000,
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

  const form = useForm<z.infer<typeof newDispensationSchema>>({
    resolver: zodResolver(newDispensationSchema),
    defaultValues: {},
  })

  const handleNext = async () => {
    let isValid = false

    if (activeTab === 'patient') {
      isValid = await form.trigger(['patientId'])
    } else if (activeTab === 'medicine') {
      isValid = await form.trigger(['stockId', 'medicineVariantId'])
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
      // await registerDispensationFn({
      //   medicinePatient: data.medicinePatient,
      //   birthDate: data.birthDate,
      //   cpf: data.cpf,
      //   gender: data.gender,
      //   name: data.name,
      //   race: data.race,
      //   sus: data.sus,
      //   generalRegistration: data.generalRegistration,
      //   batchesIds: data.batchesIds,
      // })
      toast({
        // title: `O usuário ${data} foi cadastrado com sucesso!`,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      // setTimeout(() => navigate('/dispensations'), 2000)
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
                    placeholder="Psquise por um usuário"
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
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  className=""
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
