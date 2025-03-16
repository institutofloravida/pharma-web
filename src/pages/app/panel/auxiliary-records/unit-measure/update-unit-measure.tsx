import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getUnitMeasure } from '@/api/pharma/auxiliary-records/unit-measure/get-unit-measure'
import {
  updateUnitMeasure,
  type UpdateUnitMeasureBody,
} from '@/api/pharma/auxiliary-records/unit-measure/update-unit-measure'
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

const updateUnitMeasureSchema = z.object({
  name: z.string().min(3).optional(),
  acronym: z.string().min(1).optional(),
})

type UpdateUnitMeasureSchema = z.infer<typeof updateUnitMeasureSchema>

interface UpdateUnitMeasureProps {
  unitMeasureId: string
  open: boolean
}

export function UpdateUnitMeasureDialog({
  unitMeasureId,
  open,
}: UpdateUnitMeasureProps) {
  const { token } = useAuth()

  const { data: unitmeasure, isLoading } = useQuery({
    queryKey: ['unit-measure', unitMeasureId],
    queryFn: () => getUnitMeasure({ id: unitMeasureId }, token ?? ''),
    enabled: open,
  })

  const form = useForm<UpdateUnitMeasureSchema>({
    resolver: zodResolver(updateUnitMeasureSchema),
    values: {
      name: unitmeasure?.name ?? '',
      acronym: unitmeasure?.acronym ?? '',
    },
  })

  const { mutateAsync: updateUnitMeasureFn } = useMutation({
    mutationFn: (data: UpdateUnitMeasureBody) =>
      updateUnitMeasure(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['units-measure'],
      })
    },
  })

  async function handleUpdateUnitMeasure(data: UpdateUnitMeasureSchema) {
    try {
      await updateUnitMeasureFn({
        unitMeasureId,
        name: data.name,
        acronym: data.acronym,
      })

      toast({
        title: `Unidade de Medida atualizada com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao tentar atualizar a unidade de medida.',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Unidade de Medida</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateUnitMeasure)}
          className="grid grid-cols-3 space-y-2"
        >
          {isLoading ? (
            <>
              <Skeleton className="col-span-3 h-8" />
              <Skeleton className="col-span-3 h-8" />
            </>
          ) : (
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
                name="acronym"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Abreviação</FormLabel>
                    <FormControl>
                      <Input placeholder="Abbr..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
