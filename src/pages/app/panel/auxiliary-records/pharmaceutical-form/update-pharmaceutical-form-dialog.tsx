import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getPharmaceuticalForm } from '@/api/pharma/auxiliary-records/pharmaceutical-form/get-pharmaceutical-form'
import {
  updatePharmaceuticalForm,
  type UpdatePharmaceuticalFormBody,
} from '@/api/pharma/auxiliary-records/pharmaceutical-form/update-pharmaceutical-form'
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

const updatePharmaceuticalFormSchema = z.object({
  name: z.string().min(3).optional(),
})

type UpdatePharmaceuticalFormSchema = z.infer<
  typeof updatePharmaceuticalFormSchema
>

interface UpdatePharmaceuticalFormProps {
  pharmaceuticalformId: string
  open: boolean
}

export function UpdatePharmaceuticalFormDialog({
  pharmaceuticalformId: pharmaceuticalFormId,
  open,
}: UpdatePharmaceuticalFormProps) {
  const { token } = useAuth()

  const { data: pharmaceuticalform, isLoading } = useQuery({
    queryKey: ['pharmaceutical-form', pharmaceuticalFormId],
    queryFn: () =>
      getPharmaceuticalForm({ id: pharmaceuticalFormId }, token ?? ''),
    enabled: open,
  })

  const form = useForm<UpdatePharmaceuticalFormSchema>({
    resolver: zodResolver(updatePharmaceuticalFormSchema),
    values: {
      name: pharmaceuticalform?.name ?? '',
    },
  })

  const { mutateAsync: updatePharmaceuticalFormFn } = useMutation({
    mutationFn: (data: UpdatePharmaceuticalFormBody) =>
      updatePharmaceuticalForm(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['pharmaceutical-forms'],
      })
    },
  })

  async function handleUpdatePharmaceuticalForm(
    data: UpdatePharmaceuticalFormSchema,
  ) {
    try {
      await updatePharmaceuticalFormFn({
        pharmaceuticalFormId,
        name: data.name,
      })

      toast({
        title: `Forma farmacêutica atualizada com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao tentar atualizar a forma farmacêutica.',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Forma farmacêutica</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdatePharmaceuticalForm)}
          className="grid grid-cols-3 space-y-2"
        >
          {isLoading ? (
            <>
              <Skeleton className="col-span-1 h-3" />
              <Skeleton className="col-span-3 h-8" />
            </>
          ) : (
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
