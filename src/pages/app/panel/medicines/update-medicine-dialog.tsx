import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchTherapeuticClasses } from '@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
import { getMedicine } from '@/api/pharma/medicines/get-medicine'
import {
  updateMedicine,
  type UpdateMedicineBody,
} from '@/api/pharma/medicines/update-medicine'
import { ComboboxMany } from '@/components/comboboxes/combobox-many'
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

const updateMedicineSchema = z
  .object({
    therapeuticClassesIds: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            value: z.string(),
          }),
        ]),
      )
      .min(1, {
        message: 'Selecione pelo menos uma classe terapêutica',
      })
      .optional(),
    name: z.string().min(3, 'Minímo de 3 caracteres'),
    description: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    therapeuticClassesIds:
      data.therapeuticClassesIds?.map((item) =>
        typeof item === 'string' ? item : item.id,
      ) ?? [],
  }))
type UpdateMedicineSchema = z.infer<typeof updateMedicineSchema>

interface UpdateMedicineProps {
  medicineId: string
  open: boolean
}

export function UpdateMedicineDialog({
  medicineId,
  open,
}: UpdateMedicineProps) {
  const { token } = useAuth()

  const [queryTherapeuticClass, setQueryTherapeuticClass] = useState('')

  const { data: medicine, isLoading } = useQuery({
    queryKey: ['medicine', medicineId],
    queryFn: () => getMedicine({ id: medicineId }, token ?? ''),
    enabled: open,
  })

  const form = useForm<UpdateMedicineSchema>({
    resolver: zodResolver(updateMedicineSchema),
    values: {
      name: medicine?.name ?? '',
      description: medicine?.description ?? '',
      therapeuticClassesIds:
        medicine?.therapeuticsClasses.map((tc) => tc.id) ?? [],
    },
  })

  const {
    data: therapeuticClassesResult,
    isLoading: isLoadingTherapeuticClasses,
  } = useQuery({
    queryKey: ['therapeutic-classes'],
    queryFn: () => fetchTherapeuticClasses({ page: 1 }, token ?? ''),
  })

  const { mutateAsync: updateMedicineFn } = useMutation({
    mutationFn: (data: UpdateMedicineBody) => updateMedicine(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['medicines'],
      })
    },
  })

  async function handleUpdateMedicine(data: UpdateMedicineSchema) {
    try {
      await updateMedicineFn({
        medicineId,
        name: data.name,
        description: data.description,
        therapeuticClassesIds: data.therapeuticClassesIds,
      })

      toast({
        title: `Medicamento atualizado com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao tentar atualizar a medicamento.',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Medicamento</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateMedicine)}
          className="grid grid-cols-3 space-y-2"
        >
          {isLoading ? (
            <Skeleton className="col-span-3 h-8" />
          ) : (
            <>
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
                      items={
                        therapeuticClassesResult?.therapeutic_classes ?? []
                      }
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
