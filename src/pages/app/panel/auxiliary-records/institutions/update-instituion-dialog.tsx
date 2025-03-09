import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import { getInstitution } from '@/api/pharma/auxiliary-records/institution/get-institution'
import {
  updateInstitution,
  type UpdateInstitutionBody,
} from '@/api/pharma/auxiliary-records/institution/update-institution'
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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const updateInstitutionSchema = z.object({
  name: z.string().min(3).optional(),
  cnpj: z
    .string({
      required_error: ' campos orbigatório',
    })
    .min(14, {
      message: 'O campo deve conter 14 caracteres',
    })
    .max(14, {
      message: 'O campo deve conter 14 caracteres',
    })
    .optional(),
  description: z.string().optional(),
})
type UpdateInstitutionSchema = z.infer<typeof updateInstitutionSchema>

interface UpdateInstitutionProps {
  institutionId: string
  open: boolean
}

export function UpdateInstitutionDialog({
  institutionId,
  open,
}: UpdateInstitutionProps) {
  const { token } = useAuth()

  const { data: institution } = useQuery({
    queryKey: ['institution', institutionId],
    queryFn: () => getInstitution({ id: institutionId }, token ?? ''),
    enabled: open,
  })

  const form = useForm<UpdateInstitutionSchema>({
    resolver: zodResolver(updateInstitutionSchema),
    values: {
      cnpj: institution?.cnpj ?? '',
      description: institution?.description ?? '',
      name: institution?.name ?? '',
    },
  })

  const { mutateAsync: updateInstitutionFn } = useMutation({
    mutationFn: (data: UpdateInstitutionBody) =>
      updateInstitution(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['institutions'],
      })
    },
  })

  async function handleUpdateInstitution(data: UpdateInstitutionSchema) {
    try {
      await updateInstitutionFn({
        institutionId,
        name: data.name,
        cnpj: data.cnpj,
        description: data.description,
      })

      toast({
        title: `Instituição atualizada com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao tentar atualizar a instiuição.',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Instituição</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateInstitution)}
          className="grid grid-cols-3 space-y-2"
        >
          {institution ? (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem className="col-span-3 grid">
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <InputMask
                        {...field}
                        mask="99.999.999/9999-99"
                        placeholder="CNPJ..."
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-3 grid">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
