import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import { fetchPathologies } from '@/api/auxiliary-records/pathology/fetch-pathology'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
import { SelectGender } from '@/components/selects/select-gender'
import { SelectRace } from '@/components/selects/select-race'
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
  birthDate: z.date(),
  gender: z.enum(['M', 'F', 'O'], {
    errorMap: () => ({ message: 'Gênero inválido. Deve ser M, F ou O.' }),
  }),
  race: z.enum([BLACK, INDIGENOUS, MIXED, UNDECLARED, WHITE, YELLOW], {
    errorMap: () => ({ message: 'Raça inválida.' }),
  }),
  generalRegistration: z.string().optional(),

  // addressPatient: z.object({
  //   street: z
  //     .string()
  //     .min(3, { message: 'O nome da rua deve ter pelo menos 3 caracteres.' }),
  //   number: z.string().nonempty({ message: 'O número é obrigatório.' }),
  //   complement: z.string().optional(),
  //   neighborhood: z
  //     .string()
  //     .min(3, { message: 'O bairro deve ter pelo menos 3 caracteres.' }),
  //   city: z.string().min(2, {
  //     message: 'O nome da cidade deve ter pelo menos 2 caracteres.',
  //   }),
  //   state: z
  //     .string()
  //     .length(2, { message: 'O estado deve conter exatamente 2 caracteres.' }),
  //   zipCode: z.string().regex(/^\d{5}-?\d{3}$/, {
  //     message: 'CEP inválido. Formato esperado: 00000-000.',
  //   }),
  // }),
  pathologiesIds: z
    .array(
      z
        .string()
        .nonempty({ message: 'O ID da patologia não pode estar vazio.' }),
    )
    .min(1, { message: 'Selecione pelo menos uma patologia.' }),
})

export type NewUserSchema = z.infer<typeof newUserSchema>

export function NewUserForm() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [queryPathology, setQueryPathology] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)

  // const { mutateAsync: registerUserFn, isPending: isPendingRegisterUser } =
  //   useMutation({
  //     mutationFn: (data: RegisterUserBody) => registerUser(data, token ?? ''),
  //     onSuccess() {
  //       queryClient.invalidateQueries({
  //         queryKey: ['users'],
  //       })
  //     },
  //   })

  const { data: pathologiesResult, isFetching: isFetchingPathology } = useQuery(
    {
      queryKey: ['pathologies', queryPathology],
      queryFn: () =>
        fetchPathologies({ page: 1, query: queryPathology }, token ?? ''),
      staleTime: 1000,
      refetchOnMount: true,
    },
  )
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {},
  })

  async function handleRegisterUser(data: NewUserSchema) {
    try {
      // await registerUserFn({
      //   name: data.name,
      //   email: data.,
      //   password: data.password,
      //   role: data.role,
      //   institutionsIds: data.institutionsIds,
      // })

      // toast({
      //   title: 'Sucesso!',
      //   description: 'O usuário foi registrado com sucesso.',
      //   variant: 'default',
      // })
      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ), // Converte o objeto em uma string formatada
      })
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
        className="grid w-full max-w-[600px] gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-3 grid">
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
            <FormItem className="col-span-1">
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
            <FormItem className="col-span-1">
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
            <FormItem className="col-span-1">
              <FormLabel>Registro Geral</FormLabel>
              <FormControl>
                <Input placeholder="RG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="col-span-1 grid">
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value ? field.value.toISOString().split('T')[0] : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
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
            <FormItem className="col-span-1 grid">
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
            <FormItem className="col-span-1 grid">
              <FormLabel>Cor/Raça</FormLabel>
              <SelectRace onChange={field.onChange} value={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pathologiesIds"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Pathologias</FormLabel>
              <ComboboxMany
                field={field}
                items={pathologiesResult?.pathologies ?? []}
                itemKey="id"
                onChange={(selectedItems) => field.onChange(selectedItems)}
                onQueryChange={setQueryPathology}
                query={queryPathology}
                isFetching={isFetchingPathology}
                formatItem={(item) => `${item.name}`}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-3 flex justify-between">
          <Button variant="ghost">Cancelar</Button>
          <Button type="submit">Cadastrar</Button>
        </div>
      </form>
    </Form>
  )
}
