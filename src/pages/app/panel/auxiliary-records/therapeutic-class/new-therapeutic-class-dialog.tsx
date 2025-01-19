import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerTherapeuticClass,
  type RegisterTherapeuticClassBody,
} from '@/api/pharma/auxiliary-records/therapeutic-class/register-therapeutic-class'
import { Button } from '@/components/ui/button'
import {
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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'prencha o campo',
    })
    .min(2, {
      message: 'Username must be at least 2 characters.',
    }),
  description: z.string().optional(),
})
type NewTherapeuticClassSchema = z.infer<typeof FormSchema>

export function NewTherapeuticClassDialog() {
  const { token } = useAuth()

  const { mutateAsync: registerTherapeuticClassFn } = useMutation({
    mutationFn: (data: RegisterTherapeuticClassBody) =>
      registerTherapeuticClass(data, token ?? ''),
    onSuccess(_, { name, description }) {
      const cached =
        queryClient.getQueryData<NewTherapeuticClassSchema[]>([
          'therapeutic-class',
        ]) || []
      if (cached) {
        queryClient.setQueryData(
          ['therapeutic-class'],
          [{ name, description }, ...cached],
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
        description: data.description,
      })

      toast({
        title: 'Therapeutic-class',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error) {
      toast({
        title: 'Error ao cadastrar a classe terapuetica',
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
        <DialogTitle>Nova Classe Terapêutica</DialogTitle>
        <DialogDescription>
          Cadastre sua nova classe terapêutica.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Classe Terapêutica..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva a classe terapêutica aqui..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  )
}
