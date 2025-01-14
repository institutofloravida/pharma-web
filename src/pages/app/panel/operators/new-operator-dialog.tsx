import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/auxiliary-records/institution/fetch-institutions'
import {
  registerOperator,
  type RegisterOperatorBody,
} from '@/api/operators/register-operator'
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

const newOperatorSchema = z.object({
  name: z
    .string({
      required_error: 'digite um nome',
    })
    .min(3, { message: 'mínimo de 3 caracteres' }),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['SUPER_ADMIN', 'MANAGER', 'COMMON']),
  institutionsIds: z.array(z.string()).min(1, {
    message: 'selecione pelo menos uma instituição',
  }),
})
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
      // Invalidate the 'operators' query to refetch data
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

  async function handleRegisterOperator(data: NewOperatorSchema) {
    try {
      await registerOperatorFn({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        institutionsIds: data.institutionsIds,
      })

      toast({
        title: 'Sucesso!',
        description: 'O operador foi registrado com sucesso.',
        variant: 'default', // Styling variant (if supported)
      })
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError)?.response?.data?.message ??
        'Ocorreu um erro inesperado. Por favor, tente novamente.'

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
          <FormField
            control={form.control}
            name="institutionsIds"
            render={({ field }) => (
              <FormItem className="w-[200px]">
                <FormLabel>Instituições</FormLabel>
                <ComboboxMany
                  field={field}
                  items={institutionsResult?.institutions ?? []}
                  itemKey="id"
                  onChange={(selectedItems) => field.onChange(selectedItems)}
                  onQueryChange={setQueryInstitution}
                  query={queryInstitution}
                  isFetching={isFetchingInstitutions}
                  formatItem={(item) => `${item.name}`}
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
