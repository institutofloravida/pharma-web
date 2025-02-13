import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  registerMovementType,
  type RegisterMovementTypeBody,
} from '@/api/pharma/auxiliary-records/movement-type/register-movement-type'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'
import {
  getMovementTypeTranslation,
  MovementTypeDirection,
} from '@/lib/utils/movement-type'

const { ENTRY, EXIT } = MovementTypeDirection

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Campo Obrigatório!',
    })
    .min(2, {
      message: 'O conteúdo deve conter pelo menos dois caracteres!',
    }),
  direction: z.enum([ENTRY, EXIT], {
    message: 'Campo obrigatório!',
  }),
})

export function NewMovementTypeDialog() {
  const { token } = useAuth()

  const { mutateAsync: registerMovementTypeFn } = useMutation({
    mutationFn: (data: RegisterMovementTypeBody) =>
      registerMovementType(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['movement-types'],
      })
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await registerMovementTypeFn({
        content: data.name,
        direction: data.direction,
      })

      toast({
        title: 'Tipo de movimento',
        description: `Tipo de movimentação ${data.name}(${getMovementTypeTranslation(data.direction)}) foi cadastrado com sucesso!`,
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Erro ao registrar usuário',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent className="items-centerflex flex flex-col items-center">
      <DialogHeader className="items-center">
        <DialogTitle>Tipo de Movimentação </DialogTitle>
        <DialogDescription>
          Cadastre um novo tipo de movimentação.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="tipo de movimentação..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ENTRY" />
                      </FormControl>
                      <FormLabel className="font-normal">ENTRADA</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="EXIT" />
                      </FormControl>
                      <FormLabel className="font-normal">SAÍDA</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Cadastrar</Button>
        </form>
      </Form>
    </DialogContent>
  )
}
