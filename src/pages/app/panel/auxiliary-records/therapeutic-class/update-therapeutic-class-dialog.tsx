import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getTherapeuticClass } from '@/api/pharma/auxiliary-records/therapeutic-class/get-therapeutic-class'
import {
  updateTherapeuticClass,
  type UpdateTherapeuticClassBody,
} from '@/api/pharma/auxiliary-records/therapeutic-class/update-therapeutic-class'
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

const updateTherapeuticClassSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
})
type UpdateTherapeuticClassSchema = z.infer<typeof updateTherapeuticClassSchema>

interface UpdateTherapeuticClassProps {
  therapeuticClassId: string
  open: boolean
}

export function UpdateTherapeuticClassDialog({
  therapeuticClassId,
  open,
}: UpdateTherapeuticClassProps) {
  const { token } = useAuth()

  const { data: therapeuticClass, isLoading: isLoadingTherapeuticClass } =
    useQuery({
      queryKey: ['therapeutic-class', therapeuticClassId],
      queryFn: () => {
        return getTherapeuticClass({ id: therapeuticClassId }, token ?? '')
      },
      enabled: open,
    })

  const form = useForm<UpdateTherapeuticClassSchema>({
    resolver: zodResolver(updateTherapeuticClassSchema),
    values: {
      name: therapeuticClass?.name ?? '',
      description: therapeuticClass?.description ?? '',
    },
  })

  const { mutateAsync: updateTherapeuticClassFn } = useMutation({
    mutationFn: (data: UpdateTherapeuticClassBody) =>
      updateTherapeuticClass(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['therapeutic-class'],
      })
    },
  })

  async function handleUpdateTherapeuticClass(
    data: UpdateTherapeuticClassSchema,
  ) {
    try {
      await updateTherapeuticClassFn({
        therapeuticClassId,
        name: data.name,
        description: data.description,
      })

      toast({
        title: `Classe Therapeutica atualizada com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao tentar atualizar a classe therapeutica.',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Classe Therapeutica</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateTherapeuticClass)}
          className="grid grid-cols-3 space-y-2"
        >
          {isLoadingTherapeuticClass ? (
            <Skeleton className="col-span-3 mb-2 h-8" />
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

          {isLoadingTherapeuticClass ? (
            <Skeleton className="col-span-3 h-16" />
          ) : (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="descrição..." {...field} />
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
