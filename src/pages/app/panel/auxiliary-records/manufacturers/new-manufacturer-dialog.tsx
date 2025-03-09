import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { register } from 'module'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  registerManufacturer,
  type RegisterManufacturerBody,
} from '@/api/pharma/auxiliary-records/manufacturer/register-manufacturer'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { queryClient } from '@/lib/react-query'
const newManufacturerSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório.',
    })
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),

  cnpj: z
    .string({
      required_error: 'O CNPJ é obrigatório.',
    })
    .length(14, {
      message: 'O CNPJ deve ter exatamente 14 dígitos (apenas números).',
    }),

  description: z.string({}).optional(),
})

type NewManufacturerSchema = z.infer<typeof newManufacturerSchema>

export function NewManufacturerDialog() {
  const { token } = useAuth()

  const form = useForm<NewManufacturerSchema>({
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegisterManufacturer)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da instituição..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <InputMask
                    {...field}
                    mask="99.999.999/9999-99"
                    placeholder="CNPJ..."
                    onChange={(e: any) =>
                      field.onChange(e.target.value.replace(/\D/g, ''))
                    }
                  >
                    {(inputProps: any) => <Input {...inputProps} />}
                  </InputMask>
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
                  <Textarea placeholder="sobre a instituição..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant={'ghost'}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
