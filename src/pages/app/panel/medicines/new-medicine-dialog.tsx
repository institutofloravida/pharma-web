'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { TherapeuticClass } from '@/api/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import {
  registerMedicine,
  type RegisterMedicineBody,
} from '@/api/medicines/resgister-medicine'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'

const FormSchema = z.object({
  therapeuticClassesIds: z
    .array(z.string())
    .min(1, 'selecione pelo menos uma opção'),
  name: z.string().min(1, 'campo obrigatório'),
  description: z.string().optional(),
})

type NewMedicineSchema = z.infer<typeof FormSchema>
interface NewMedicineDialogProps {
  therapeuticClasses: TherapeuticClass[]
}

export function NewMedicineDialog({
  therapeuticClasses,
}: NewMedicineDialogProps) {
  const { token } = useAuth()
  const { mutateAsync: registerMedicineFn } = useMutation({
    mutationFn: (data: RegisterMedicineBody) =>
      registerMedicine(data, token ?? ''),
    onSuccess(_, { name, description, therapeuticClassesIds }) {
      const cached =
        queryClient.getQueryData<NewMedicineSchema[]>(['medicines']) || []

      if (cached) {
        queryClient.setQueryData(
          ['medicines'],
          [...cached, { name, description, therapeuticClassesIds }],
        )
      }
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      therapeuticClassesIds: [],
    },
  })

  async function handleRegisterMedicine(data: z.infer<typeof FormSchema>) {
    try {
      await registerMedicineFn({
        name: data.name,
        description: data.description,
        therapeuticClassesIds: data.therapeuticClassesIds,
      })

      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error) {
      toast({
        title: 'Error ao cadastrar o estoque',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      })
    }
  }
  return (
    <DialogContent className="flex flex-col items-center">
      <DialogHeader className="items-center">
        <DialogTitle>Novo Medicamento</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar um novo medicamento.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegisterMedicine)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Medicamento..." {...field} />
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
                    placeholder="Descreva o medicamento..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="therapeuticClassesIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Classes Terapêuticas
                  </FormLabel>
                  <FormDescription>
                    Selecione as classes terapẽuticas que o medicamento possui.
                  </FormDescription>
                </div>
                <ScrollArea
                  className="m-10 h-48 rounded-md"
                  aria-label="Selectable items"
                >
                  <div className="p-2">
                    {therapeuticClasses.map((item) => (
                      <>
                        <FormField
                          control={form.control}
                          name="therapeuticClassesIds"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id,
                                          ),
                                        )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <Separator className="my-2" />
                      </>
                    ))}
                  </div>
                </ScrollArea>
                <FormMessage>
                  {form.formState.errors.therapeuticClassesIds?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  )
}
