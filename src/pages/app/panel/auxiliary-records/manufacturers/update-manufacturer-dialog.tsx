import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import { getManufacturer } from '@/api/pharma/auxiliary-records/manufacturer/get-manufacturer'
import {
  updateManufacturer,
  type UpdateManufacturerBody,
} from '@/api/pharma/auxiliary-records/manufacturer/update-manufacturer'
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

const updateManufacturerSchema = z.object({
  name: z.string().min(3).optional(),
  cnpj: z
    .string({
      required_error: ' campo obrigatório',
    })
    .min(14, {
      message: 'O campo deve conter 14 caracteres',
    })
    .max(14, {
      message: 'O CNPJ deve conter 14 caracteres',
    }),
  description: z.string().optional(),
})
type UpdateManufacturerSchema = z.infer<typeof updateManufacturerSchema>

interface UpdateManufacturerProps {
  manufacturerId: string
  open: boolean
}

export function UpdateManufacturerDialog({
  manufacturerId,
  open,
}: UpdateManufacturerProps) {
  const { token } = useAuth()

  const { data: manufacturer, isLoading: isLoadingManufacturer } = useQuery({
    queryKey: ['manufacturer', manufacturerId],
    queryFn: () => getManufacturer({ id: manufacturerId }, token ?? ''),
    enabled: open,
  })

  const form = useForm<UpdateManufacturerSchema>({
    resolver: zodResolver(updateManufacturerSchema),
    values: {
      cnpj: manufacturer?.cnpj ?? '',
      description: manufacturer?.description ?? '',
      name: manufacturer?.name ?? '',
    },
  })

  const { mutateAsync: updateManufacturerFn } = useMutation({
    mutationFn: (data: UpdateManufacturerBody) =>
      updateManufacturer(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['manufacturers'],
      })
      queryClient.invalidateQueries({
        queryKey: ['manufacturer', manufacturerId],
      })
    },
  })

  async function handleUpdateManufacturer(data: UpdateManufacturerSchema) {
    try {
      await updateManufacturerFn({
        manufacturerId,
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
        <DialogTitle>Atualizar Fabricante</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateManufacturer)}
          className="space-y-2"
        >
          {isLoadingManufacturer ? (
            <Skeleton className="col-span-3 h-8" />
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

          {isLoadingManufacturer ? (
            <Skeleton className="col-span-3 h-8" />
          ) : (
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
          )}

          {isLoadingManufacturer ? (
            <Skeleton className="col-span-3 h-24" />
          ) : (
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
