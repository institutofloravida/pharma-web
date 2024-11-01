import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  registerInstitution,
  type RegisterInstitutionBody,
} from '@/api/register-institution'
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

const newInstitutionSchema = z.object({
  name: z.string().min(3),
  cnpj: z.string(),
  description: z.string(),
})
type NewInstitutionSchema = z.infer<typeof newInstitutionSchema>

export function NewInstitutionDialog() {
  const { token } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewInstitutionSchema>({
    resolver: zodResolver(newInstitutionSchema),
  })

  const { mutateAsync: registerInstitutionFn } = useMutation({
    mutationFn: (data: RegisterInstitutionBody) =>
      registerInstitution(data, token ?? ''),
  })

  async function handleRegisterInstitution(data: NewInstitutionSchema) {
    try {
      // console.log(token)
      await registerInstitutionFn({
        name: data.name,
        cnpj: data.cnpj,
        description: data.description,
      })

      toast.success(`Instituição ${data.name} registrada com sucesso!`)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível registrar a Institutição. Tente Novamente!')
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova Institutição</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar uma nova instituição.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterInstitution)}>
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
              placeholder="Sobre a instituição..."
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
