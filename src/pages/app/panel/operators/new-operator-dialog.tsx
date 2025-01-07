import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerOperator,
  type RegisterOperatorBody,
} from '@/api/operators/register-operator'
import { SelectRole } from '@/components/selects/select-role'
import { Button } from '@/components/ui/button'
import {
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
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'

const newOperatorSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['SUPER_ADMIN', 'MANAGER', 'COMMON']),
})
type NewOperatorSchema = z.infer<typeof newOperatorSchema>

export function NewOperatorDialog() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  const { mutateAsync: registerOperatorFn } = useMutation({
    mutationFn: (data: RegisterOperatorBody) =>
      registerOperator(data, token ?? ''),
    onSuccess(_, { name, email, role }) {
      const cached =
        queryClient.getQueryData<NewOperatorSchema[]>(['operators']) || []

      if (cached) {
        queryClient.setQueryData(
          ['operators'],
          [...cached, { name, email, role }],
        )
      }
    },
  })

  const form = useForm<z.infer<typeof newOperatorSchema>>({
    resolver: zodResolver(newOperatorSchema),
  })

  async function handleRegisterOperator(data: NewOperatorSchema) {
    try {
      await registerOperatorFn({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      console.log('Asdsdasf')
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch {
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo Operador</DialogTitle>
        <DialogDescription>
          Preencha todas as informações para registrar um novo usuário
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegisterOperator)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Operador..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="Senha..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <SelectRole onChange={field.onChange} value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant={'ghost'}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
