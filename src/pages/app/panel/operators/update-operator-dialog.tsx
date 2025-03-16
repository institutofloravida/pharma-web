import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import { getOperator } from '@/api/pharma/operators/get-operator'
import { OperatorRole } from '@/api/pharma/operators/register-operator'
import {
  updateOperator,
  type UpdateOperatorBody,
} from '@/api/pharma/operators/update-operator'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
import { SelectRole } from '@/components/selects/select-role'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
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
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const updateOperatorSchema = z
  .object({
    name: z
      .string({
        required_error: 'Digite um nome',
      })
      .min(3, { message: 'Mínimo de 3 caracteres' }),
    email: z.string().email(),
    role: z.nativeEnum(OperatorRole).optional(),
    institutionsIds: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            value: z.string(),
          }),
        ]),
      )
      .min(1, {
        message: 'Selecione pelo menos uma instituição',
      })
      .optional(),
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
  .transform((data) => ({
    ...data,
    institutionsIds:
      data.institutionsIds?.map((item) =>
        typeof item === 'string' ? item : item.id,
      ) ?? [],
  }))

type UpdateOperatorSchema = z.infer<typeof updateOperatorSchema>

interface UpdateOperatorProps {
  operatorId: string
  open: boolean
}

export function UpdateOperatorDialog({
  operatorId,
  open,
}: UpdateOperatorProps) {
  const { token } = useAuth()
  const [queryInstitution, setQueryInstitution] = useState('')

  const { data: operator } = useQuery({
    queryKey: ['operator', operatorId],
    queryFn: () => getOperator({ id: operatorId }, token ?? ''),
    enabled: open,
  })

  const { data: institutionsResult, isFetching: isFetchingInstitutions } =
    useQuery({
      queryKey: ['institutions', queryInstitution],
      queryFn: () =>
        fetchInstitutions({ page: 1, query: queryInstitution }, token ?? ''),
      staleTime: 1000,
      refetchOnMount: true,
    })

  const form = useForm<z.infer<typeof updateOperatorSchema>>({
    resolver: zodResolver(updateOperatorSchema),
    values: {
      name: operator?.name ?? '',
      email: operator?.email ?? '',
      role: operator?.role ?? undefined,
      institutionsIds:
        operator?.institutions.map((institution) => institution.id) ?? [],
    },
  })

  const roleWatch = form.watch('role')
  const isSuperAdmin = roleWatch === 'SUPER_ADMIN'

  const { mutateAsync: updateOperatorFn } = useMutation({
    mutationFn: (data: UpdateOperatorBody) => updateOperator(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['operators'],
      })
    },
  })

  async function handleUpdateOperator(data: UpdateOperatorSchema) {
    try {
      await updateOperatorFn({
        operatorId,
        name: data.name,
        email: data.email,
        role: data.role ? OperatorRole[data.role] : undefined,
        institutionsIds: isSuperAdmin ? [] : data.institutionsIds,
      })

      toast({
        title: `Operador atualizada com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao tentar atualizar a operador.',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Operador</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateOperator)}
          className="grid grid-cols-3 space-y-2"
        >
          {operator ? (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
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
                  <FormItem className="col-span-3">
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
                name="role"
                render={({ field }) => (
                  <FormItem className="col-span-3">
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
                      <FormItem className="col-span-3">
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
            </>
          ) : (
            <>
              <Skeleton className="col-span-3 h-8" />
              <Skeleton className="col-span-3 h-8" />
              <Skeleton className="col-span-3 h-24" />
            </>
          )}

          <DialogFooter className="col-span-3 grid justify-end">
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant={'ghost'}>Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Atualizar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
