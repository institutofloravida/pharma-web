import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerUnitMeasure,
  type RegisterUnitMeasureBody,
} from '@/api/pharma/auxiliary-records/unit-measure/register-unit-measure'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
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
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Preencha o campo',
    })
    .min(1, { message: 'O campo deve ter pelo menos 1 caractere' }),

  acronym: z
    .string({
      required_error: 'Preencha o campo',
    })
    .min(1, { message: 'O campo deve ter pelo menos 1 caractere' })
    .max(10, { message: 'O campo deve ter no máximo 10 caracteres' }),
})

export function NewUnitMeasureDialog() {
  const { token } = useAuth()

  const { mutateAsync: registerTherapeuticClassFn } = useMutation({
    mutationFn: (data: RegisterUnitMeasureBody) =>
      registerUnitMeasure(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['units-measure'],
      })
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await registerTherapeuticClassFn({
        name: data.name,
        acronym: data.acronym,
      })

      toast({
        title: 'Unidade de Medida cadastrada com sucesso!',
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova Unidade de medida</DialogTitle>
        <DialogDescription>
          Cadastre sua nova unidade de medida.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Unidade de medida..." {...field} />
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
                  <Input placeholder="Abreviação..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="col-span-3 grid justify-end">
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant={'ghost'}>Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
