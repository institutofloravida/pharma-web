import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { fetchCities } from '@/api/ibge/fetch-cities'
import { fetchStates } from '@/api/ibge/fetch-states'
import { fetchPathologies } from '@/api/pharma/auxiliary-records/pharmaceutical-form/pathology/fetch-pathology'
import {
  registerUser,
  type RegisterUserBody,
} from '@/api/pharma/users/register-user'
import { getAddressByCep } from '@/api/viacep/get-address-by-cep'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { DateTimePicker } from '@/components/datetime-picker'
import { SelectGender } from '@/components/selects/select-gender'
import { SelectRace } from '@/components/selects/select-race'
import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/utils/handle-api-error'
import { Race } from '@/lib/utils/race'
const { BLACK, INDIGENOUS, MIXED, UNDECLARED, WHITE, YELLOW } = Race
export const newUserSchema = z.object({
  name: z
    .string({ required_error: 'campo obrigatório' })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    .max(100, { message: 'O nome pode ter no máximo 100 caracteres.' }),
  cpf: z
    .string()
    .regex(/^\d{11}$/, { message: 'O CPF deve conter exatamente 11 dígitos.' }),
  sus: z
    .string()
    .regex(/^\d{15}$/, { message: 'O SUS deve conter exatamente 15 dígitos.' }),
  birthDate: z.coerce.date(),
  gender: z.enum(['M', 'F', 'O'], {
    errorMap: () => ({ message: 'Gênero inválido. Deve ser M, F ou O.' }),
  }),
  race: z.enum([BLACK, INDIGENOUS, MIXED, UNDECLARED, WHITE, YELLOW], {
    errorMap: () => ({ message: 'Raça inválida.' }),
  }),
  generalRegistration: z.string().optional(),

  addressPatient: z.object({
    street: z
      .string()
      .min(3, { message: 'O nome da rua deve ter pelo menos 3 caracteres.' }),
    number: z.string().min(1, { message: 'O número é obrigatório.' }),
    complement: z.string().optional(),
    neighborhood: z
      .string()
      .min(3, { message: 'O bairro deve ter pelo menos 3 caracteres.' }),
    city: z.string().min(2, {
      message: 'O nome da cidade deve ter pelo menos 2 caracteres.',
    }),
    state: z
      .string()
      .length(2, { message: 'O estado deve conter exatamente 2 caracteres.' }),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, {
      message: 'CEP inválido. Formato esperado: 00000-000.',
    }),
  }),
  pathologiesIds: z
    .array(
      z.object({
        id: z
          .string()
          .min(1, { message: 'O ID da patologia não pode estar vazio.' }),
        value: z.string(), // Inclui o valor para validar o formato dos objetos
      }),
    )
    .min(1, { message: 'Selecione pelo menos uma patologia.' })
    .transform((items) => items.map((item) => item.id)),
})

export type NewUserSchema = z.infer<typeof newUserSchema>

export function NewUserForm() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [queryPathology, setQueryPathology] = useState('')
  const [queryCity, setQueryCity] = useState('')
  const [queryState, setQueryState] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [zipCode, setZipCode] = useState('')
  const [activeTab, setActiveTab] = useState('personal-data')

  const navigate = useNavigate()

  const { mutateAsync: registerUserFn, isPending: isPendingRegisterUser } =
    useMutation({
      mutationFn: (data: RegisterUserBody) => registerUser(data, token ?? ''),
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['users'],
        })
      },
    })

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {},
  })

  const handleNext = async () => {
    let isValid = false

    if (activeTab === 'personal-data') {
      isValid = await form.trigger([
        'name',
        'cpf',
        'sus',
        'generalRegistration',
        'birthDate',
        'gender',
        'race',
      ])
    } else if (activeTab === 'address') {
      isValid = await form.trigger([
        'addressPatient.zipCode',
        'addressPatient.state',
        'addressPatient.city',
        'addressPatient.neighborhood',
        'addressPatient.street',
        'addressPatient.number',
      ])
    }

    if (isValid) {
      if (activeTab === 'personal-data') {
        setActiveTab('address')
      } else if (activeTab === 'address') {
        setActiveTab('pathologies')
      }
    } else {
      console.log('Por favor, preencha os campos obrigatórios.')
    }
  }
  const handlePrevious = () => {
    if (activeTab === 'pathologies') {
      setActiveTab('address')
    } else if (activeTab === 'address') {
      setActiveTab('personal-data')
    }
  }

  const {
    data: addressResult,
    isSuccess: isSuccessAddress,
    isError: isErrorAddress,
    isFetching: isFetchingAddress,
  } = useQuery({
    queryKey: ['address', zipCode],
    queryFn: () => getAddressByCep(zipCode),
    enabled: zipCode.length === 8,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (isSuccessAddress && addressResult) {
      form.setValue('addressPatient.street', addressResult.logradouro || '')
      form.setValue('addressPatient.neighborhood', addressResult.bairro || '')
      form.setValue('addressPatient.city', addressResult.localidade || '')
      form.setValue('addressPatient.state', addressResult.uf || '')
    }

    if (isErrorAddress) {
      toast({
        title: 'Erro ao buscar endereço',
        description: 'Verifique se o CEP é válido e tente novamente.',
        variant: 'destructive',
      })
    }
  }, [isSuccessAddress, isErrorAddress, addressResult, form])

  const { data: pathologiesResult, isFetching: isFetchingPathology } = useQuery(
    {
      queryKey: ['pathologies', queryPathology],
      queryFn: () =>
        fetchPathologies({ page: 1, query: queryPathology }, token ?? ''),
      staleTime: 1000,
      refetchOnMount: true,
    },
  )
  const { data: statesResult, isFetching: isFetchingStates } = useQuery({
    queryKey: ['states'],
    queryFn: () => fetchStates(),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: citiesResult, isFetching: isFetchingCities } = useQuery({
    queryKey: ['cities', form.watch('addressPatient.state')],
    queryFn: () => fetchCities(form.watch('addressPatient.state')),
    enabled: !!form.watch('addressPatient.state'),
    staleTime: 1000,
    refetchOnMount: true,
  })

  async function handleRegisterUser(data: NewUserSchema) {
    try {
      await registerUserFn({
        addressPatient: data.addressPatient,
        birthDate: data.birthDate,
        cpf: data.cpf,
        gender: data.gender,
        name: data.name,
        race: data.race,
        sus: data.sus,
        generalRegistration: data.generalRegistration,
        pathologiesIds: data.pathologiesIds,
      })
      toast({
        title: `O usuário ${data.name} foi cadastrado com sucesso!`,
      })
      setTimeout(() => navigate('/users'), 2000)
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao registrar usuário',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegisterUser)}
        className="grid w-full max-w-[800px]"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="personal-data"
        >
          <TabsList>
            <TabsTrigger
              value="personal-data"
              disabled={['address', 'pathologies'].includes(activeTab)}
            >
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="address"
              disabled={['personal-data', 'pathologies'].includes(activeTab)}
            >
              Endereço
            </TabsTrigger>
            <TabsTrigger
              value="pathologies"
              disabled={['personal-data', 'address'].includes(activeTab)}
            >
              Patologias
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="personal-data"
            className="grid w-full gap-2 space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do Usuário..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <InputMask
                      {...field}
                      mask="999.999.999-99"
                      placeholder="CPF..."
                      onChange={(e: any) =>
                        field.onChange(e.target.value.replace(/\D/g, ''))
                      }
                    >
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sus"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>SUS</FormLabel>
                  <FormControl>
                    <InputMask
                      {...field}
                      mask="99999.99999.99999"
                      placeholder="SUS..."
                      onChange={(e: any) =>
                        field.onChange(e.target.value.replace(/\D/g, ''))
                      }
                    >
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generalRegistration"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Registro Geral</FormLabel>
                  <FormControl>
                    <Input placeholder="RG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      lang="pt"
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      hideTime
                      timezone="UTC"
                      value={field.value || null} // ✅ Garante que não quebre se for null
                      onChange={(date) => field.onChange(date?.toISOString())} // ✅ Atualiza o formulário corretamente
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Gênero</FormLabel>
                  <SelectGender onChange={field.onChange} value={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="race"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Cor/Raça</FormLabel>
                  <SelectRace onChange={field.onChange} value={field.value} />
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
            value="address"
            className="grid w-full gap-2 space-y-2 pl-2"
          >
            <FormField
              control={form.control}
              name="addressPatient.zipCode"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <InputMask
                      {...field}
                      mask="99-999-999"
                      placeholder="CEP..."
                      onChange={(e: any) => {
                        const cleanZip = e.target.value.replace(/\D/g, '')
                        setZipCode(cleanZip)
                        form.setValue('addressPatient.zipCode', cleanZip)
                      }}
                    >
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </FormControl>
                  <FormDescription>
                    {isFetchingAddress && <span>Carregando...</span>}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressPatient.state"
              render={({ field }) => (
                <FormItem className="col-span-3 flex flex-col gap-1">
                  <FormLabel>Estado</FormLabel>
                  <ComboboxUp
                    field={field}
                    items={statesResult ?? []}
                    itemKey="sigla"
                    onQueryChange={setQueryState}
                    query={queryState}
                    isFetching={isFetchingStates}
                    formatItem={(item) => `${item.sigla} - ${item.nome}`}
                    placeholder="Selecione um estado"
                    onSelect={(item) => {
                      form.setValue('addressPatient.state', item)
                      form.setValue('addressPatient.city', '')
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressPatient.city"
              render={({ field }) => (
                <FormItem className="col-span-3 row-span-1 grid gap-1">
                  <FormLabel>Cidade</FormLabel>
                  <ComboboxUp
                    field={field}
                    items={citiesResult ?? []}
                    itemKey="nome"
                    onQueryChange={setQueryCity}
                    query={queryCity}
                    isFetching={isFetchingCities}
                    formatItem={(item) => `${item.nome}`}
                    placeholder="Selecione uma cidade"
                    onSelect={(item) =>
                      form.setValue('addressPatient.city', item)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressPatient.neighborhood"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressPatient.street"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressPatient.number"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="número..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressPatient.complement"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Complemento..." {...field} />
                  </FormControl>
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
            value="pathologies"
            className="grid w-full max-w-[300px] gap-2 space-y-2 pl-2"
          >
            <FormField
              control={form.control}
              name="pathologiesIds"
              render={({ field }) => (
                <FormItem className="col-span-6 row-span-2 ml-5 grid">
                  <FormLabel>Patologias</FormLabel>
                  <ComboboxMany
                    field={field}
                    items={pathologiesResult?.pathologies ?? []}
                    itemKey="id"
                    onChange={(selectedItems) => field.onChange(selectedItems)} // Recebe objetos diretamente
                    onQueryChange={setQueryPathology}
                    query={queryPathology}
                    isFetching={isFetchingPathology}
                    formatItem={(item) => `${item.name}`}
                    placeholder="Selecione uma patologia"
                    placeholderAferSelected="patologia(s) selecionada(s)"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
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
