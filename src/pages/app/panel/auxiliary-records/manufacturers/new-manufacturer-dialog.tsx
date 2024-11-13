import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  registerManufacturer,
  type RegisterManufacturerBody,
} from '@/api/auxiliary-records/manufacturer/register-manufacturer'
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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { queryClient } from '@/lib/react-query'

const newManufacturerSchema = z.object({
  name: z.string().min(3),
  cnpj: z.string(),
  description: z.string(),
})
type NewManufacturerSchema = z.infer<typeof newManufacturerSchema>

export function NewManufacturerDialog() {
  const { token } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewManufacturerSchema>({
    resolver: zodResolver(newManufacturerSchema),
  })

  const { mutateAsync: registerManufacturerFn } = useMutation({
    mutationFn: (data: RegisterManufacturerBody) =>
      registerManufacturer(data, token ?? ''),
    onSuccess(_, { name, cnpj, description }) {
      const cached =
        queryClient.getQueryData<NewManufacturerSchema[]>(['manufacturers']) ||
        []

      if (cached) {
        queryClient.setQueryData(
          ['manufacturers'],
          [...cached, { name, cnpj, description }],
        )
      }
    },
  })

  async function handleRegisterManufacturer(data: NewManufacturerSchema) {
    try {
      await registerManufacturerFn({
        name: data.name,
        cnpj: data.cnpj,
        description: data.description,
      })

      toast.success(`Fabricante ${data.name} registrada com sucesso!`)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível registra o fabricante. Tente Novamente!')
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo fabricante</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar um novo fabricante.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterManufacturer)}>
        <div className="grid gap-2">
          <div className="flex-col gap-2">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" className="col-span-3" {...register('name')} />
          </div>
          <div className="flex-col">
            <Label htmlFor="cnpj" className="text-right">
              CNPJ
            </Label>
            <Input id="cnpj" className="col-span-3" {...register('cnpj')} />
          </div>
          <div className="flex-col">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              className="col-span-3 min-h-[120px]"
              placeholder="Sobre a fabricante..."
              {...register('description')}
            />
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
