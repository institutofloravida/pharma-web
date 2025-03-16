import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerPathology,
  type RegisterPathologyBody,
} from '@/api/pharma/auxiliary-records/pharmaceutical-form/pathology/register-pathology'
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

const newPathologySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    .max(50, { message: 'O nome pode ter no máximo 50 caracteres' }),
})

type NewPathologySchema = z.infer<typeof newPathologySchema>

export function NewPathologyDialog() {
  const { token } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewPathologySchema>({
    resolver: zodResolver(newPathologySchema),
  })

  const { mutateAsync: registerPathologyFn } = useMutation({
    mutationFn: (data: RegisterPathologyBody) =>
      registerPathology(data, token ?? ''),
    onSuccess(_, { name }) {
      const cached =
        queryClient.getQueryData<NewPathologySchema[]>(['pathologies']) || []

      if (cached) {
        queryClient.setQueryData(['pathologies'], [...cached, { name }])
      }
    },
  })

  async function handleRegisterPathology(data: NewPathologySchema) {
    try {
      await registerPathologyFn({
        name: data.name,
      })

      toast({
        title: 'Patologia cadastrada com suceso!',
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Error ao cadastrara patologia',
        description: errorMessage,
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova patologia</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar um nova patologia.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterPathology)}>
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
