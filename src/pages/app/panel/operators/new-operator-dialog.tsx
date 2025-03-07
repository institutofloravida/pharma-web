import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import {
  OperatorRole,
  registerOperator,
  type RegisterOperatorBody,
} from '@/api/pharma/operators/register-operator'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
import { SelectRole } from '@/components/selects/select-role'
import { Button } from '@/components/ui/button'
import {
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
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/utils/handle-api-error'

const newOperatorSchema = z
  .object({
    name: z
      .string({
        required_error: 'Digite um nome',
      })
      .min(3, { message: 'Mínimo de 3 caracteres' }),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Mínimo de 8 caracteres' }),
    role: z.nativeEnum(OperatorRole),
    institutionsIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'SUPER_ADMIN') {
        return true
      }
      return data.institutionsIds && data.institutionsIds.length > 0
    },
    {
      message: 'Selecione pelo menos uma instituição',
      path: ['institutionsIds'],
    },
  )

type NewOperatorSchema = z.infer<typeof newOperatorSchema>

export function NewOperatorDialog() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [queryInstitution, setQueryInstitution] = useState('')

  const {
    mutateAsync: registerOperatorFn,
    isPending: isPendingRegisterOperator,
  } = useMutation({
    mutationFn: (data: RegisterOperatorBody) =>
      registerOperator(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['operators'],
      })
    },
  })

  const { data: institutionsResult, isFetching: isFetchingInstitutions } =
    useQuery({
      queryKey: ['institutions', queryInstitution],
      queryFn: () =>
        fetchInstitutions({ page: 1, query: queryInstitution }, token ?? ''),
      staleTime: 1000,
      refetchOnMount: true,
    })

  const form = useForm<z.infer<typeof newOperatorSchema>>({
    resolver: zodResolver(newOperatorSchema),
    defaultValues: {
      institutionsIds: [],
    },
  })

  const roleWatch = form.watch('role')
  const isSuperAdmin = roleWatch === 'SUPER_ADMIN'

  async function handleRegisterOperator(data: NewOperatorSchema) {
    try {
      await registerOperatorFn({
        name: data.name,
        email: data.email,
        password: data.password,
        role: OperatorRole[data.role],
        institutionsIds: isSuperAdmin ? [] : data.institutionsIds,
      })

      toast({
        title: 'Sucesso!',
        description: 'O operador foi registrado com sucesso.',
        variant: 'default',
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao registrar operador',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo Operador</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar um novo operador
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegisterOperator)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Operador..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Senha..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de usuário</FormLabel>
                <SelectRole onChange={field.onChange} value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
          {!isSuperAdmin && (
            <FormField
              control={form.control}
              name="institutionsIds"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Instituições</FormLabel>
                    <ComboboxMany
                      field={{
                        value: field.value.map((id) => {
                          const institution =
                            institutionsResult?.institutions.find(
                              (inst) => inst.id === id,
                            )
                          return {
                            id,
                            value: institution
                              ? institution.name
                              : 'Carregando...',
                          }
                        }),
                      }}
                      items={institutionsResult?.institutions ?? []}
                      itemKey="id"
                      onChange={(selectedItems) =>
                        field.onChange(selectedItems.map((item) => item.id))
                      }
                      onQueryChange={setQueryInstitution}
                      query={queryInstitution}
                      isFetching={isFetchingInstitutions}
                      formatItem={(item) => `${item.name}`}
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant={'ghost'}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPendingRegisterOperator}>
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
