import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerUnitMeasure,
  type RegisterUnitMeasureBody,
} from '@/api/auxiliary-records/unit-measure/register-unit-measure'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
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

type NewUnitMeasureSchema = z.infer<typeof FormSchema>

export function NewUnitMeasureDialog() {
  const { token } = useAuth()

  const { mutateAsync: registerTherapeuticClassFn } = useMutation({
    mutationFn: (data: RegisterUnitMeasureBody) =>
      registerUnitMeasure(data, token ?? ''),
    onSuccess(_, { name, acronym }) {
      const cached =
        queryClient.getQueryData<NewUnitMeasureSchema[]>(['units-measure']) ||
        []
      if (cached) {
        queryClient.setQueryData(
          ['units-measure'],
          [{ name, acronym }, ...cached],
        )
      }
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
      toast({
        title: 'Error ao cadastrar a unidade de medida',
        variant: 'destructive',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(error.message, null, 2)}
            </code>
          </pre>
        ),
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
          className="space-y-auto w-[80%] space-x-0 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>Abreviação</FormLabel>
                <FormControl>
                  <Input placeholder="Abreviação..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant={'outline'}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
