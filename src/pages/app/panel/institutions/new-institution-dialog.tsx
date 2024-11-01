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
import { useAuth } from '@/contexts/authContext'

const newInstitutionSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['ADMIN', 'COMMOM']),
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
      await registerInstitutionFn({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })

      toast.success(`Operador ${data.name} registrado com sucesso!`)
    } catch {
      toast.error('Não foi possível registrar o operador. Tente Novamente!')
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo Operador</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar um novo usuário
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
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" className="col-span-3" {...register('email')} />
          </div>
          <div className="flex-col">
            <Label htmlFor="password" className="text-right">
              Senha
            </Label>
            <Input
              id="password"
              className="col-span-3"
              {...register('password')}
            />
          </div>
          <div className="flex-col">
            <Label htmlFor="role" className="text-right">
              role
            </Label>
            <Input
              id="role"
              value="ADMIN"
              className="col-span-3"
              {...register('role')}
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
