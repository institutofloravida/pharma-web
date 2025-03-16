'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchTherapeuticClasses } from '@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import {
  registerMedicine,
  type RegisterMedicineBody,
} from '@/api/pharma/medicines/resgister-medicine'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const FormSchema = z.object({
  therapeuticClassesIds: z
    .array(z.string())
    .min(1, 'selecione pelo menos uma opção'),
  name: z.string().min(1, 'campo obrigatório'),
  description: z.string().optional(),
})

type NewMedicineSchema = z.infer<typeof FormSchema>

export function NewMedicineDialog() {
  const { token } = useAuth()

  const [queryTherapeuticClass, setQueryTherapeuticClass] = useState('')

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

  const {
    data: therapeuticClassesResult,
    isLoading: isLoadingTherapeuticClasses,
  } = useQuery({
    queryKey: ['therapeutic-classes'],
    queryFn: () => fetchTherapeuticClasses({ page: 1 }, token ?? ''),
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
        title: 'Medicamento cadastrado com Sucesso!',
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Error ao cadastrar o medicamento',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo Medicamento</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar um novo medicamento.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegisterMedicine)}
          className="grid grid-cols-3 space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
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
              <FormItem className="col-span-3">
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
            render={({ field }) => (
              <FormItem className="col-span-3 row-span-2">
                <FormLabel>Classes Terapeuticas</FormLabel>
                <ComboboxMany
                  field={{
                    value: field.value.map((id) => {
                      const therapeuticClass =
                        therapeuticClassesResult?.therapeutic_classes.find(
                          (inst) => inst.id === id,
                        )
                      return {
                        id,
                        value: therapeuticClass
                          ? therapeuticClass.name
                          : 'Carregando...',
                      }
                    }),
                  }}
                  items={therapeuticClassesResult?.therapeutic_classes ?? []}
                  itemKey="id"
                  onChange={(selectedItems) =>
                    field.onChange(selectedItems.map((item) => item.id))
                  }
                  onQueryChange={setQueryTherapeuticClass}
                  query={queryTherapeuticClass}
                  isFetching={isLoadingTherapeuticClasses}
                  formatItem={(item) => `${item.name}`}
                  placeholder="Selecione uma classe terapeutica"
                  placeholderAferSelected="classe(s) terapeutica(s)"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="col-span-3 grid justify-end">
            <div className="flex-gap-2">
              <DialogClose asChild>
                <Button variant={'ghost'}>Cancelar</Button>
              </DialogClose>
              <Button type="submit">Enviar</Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
