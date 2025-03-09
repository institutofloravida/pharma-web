import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerPharmaceuticalForm,
  type RegisterPharmaceuticalFormBody,
} from '@/api/pharma/auxiliary-records/pharmaceutical-form/register-pharmaceutical-form'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const newPharmaceuticalFormSchema = z.object({
  name: z.string().min(3),
})
type NewPharmaceuticalFormSchema = z.infer<typeof newPharmaceuticalFormSchema>

export function NewPharmaceuticalFormDialog() {
  const { token } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewPharmaceuticalFormSchema>({
    resolver: zodResolver(newPharmaceuticalFormSchema),
  })

  const { mutateAsync: registerPharmaceuticalFormFn } = useMutation({
    mutationFn: (data: RegisterPharmaceuticalFormBody) =>
      registerPharmaceuticalForm(data, token ?? ''),
    onSuccess(_, { name }) {
      const cached =
        queryClient.getQueryData<NewPharmaceuticalFormSchema[]>([
          'pharmaceutical-forms',
        ]) || []
      if (cached) {
        queryClient.setQueryData(
          ['pharmaceutical-forms'],
          [{ name }, ...cached],
        )
      }
    },
  })

  async function handleRegisterPharmaceuticalForm(
    data: NewPharmaceuticalFormSchema,
  ) {
    try {
      await registerPharmaceuticalFormFn({
        name: data.name,
      })

      toast({
        title: 'Forma farmaceutica cadastrada com sucesso!',
      })
    } catch (error) {
      const errorMessage = handleApiError(error)

      toast({
        title: 'Error ao cadastrar a forma farmacêutica!',
        description: errorMessage,
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova Forma farmacêutica</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar uma nova forma
          farmacêutica.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterPharmaceuticalForm)}>
        <div className="grid gap-2">
          <div className="flex-col gap-2">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" className="col-span-3" {...register('name')} />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant={'ghost'}>Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            Cadastrar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
