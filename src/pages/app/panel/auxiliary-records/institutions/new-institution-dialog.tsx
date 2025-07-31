import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import {
  InstitutionType,
  registerInstitution,
  type RegisterInstitutionBody,
} from '@/api/pharma/auxiliary-records/institution/register-institution'
import { SelectInstitutionType } from '@/components/selects/select-institution-type'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const newInstitutionSchema = z.object({
  name: z.string().min(3),
  responsible: z.string().min(3, {
    message: 'O nome do responsável deve ter pelo menos 3 caracteres',
  }),
  type: z.nativeEnum(InstitutionType, {
    errorMap: () => ({ message: 'Selecione um tipo de instituição' }),
  }),
  controlStock: z.boolean(),
  cnpj: z
    .string()
    .min(14, { message: 'O CNPJ deve ter 14 caracteres' })
    .max(14, { message: 'O CNPJ deve ter 14 caracteres' }),
  description: z.string().optional(),
})
type NewInstitutionSchema = z.infer<typeof newInstitutionSchema>

export function NewInstitutionDialog() {
  const { token } = useAuth()
  const form = useForm<NewInstitutionSchema>({
    resolver: zodResolver(newInstitutionSchema),
    defaultValues: {
      controlStock: false,
    },
  })

  const { mutateAsync: registerInstitutionFn } = useMutation({
    mutationFn: (data: RegisterInstitutionBody) =>
      registerInstitution(data, token ?? ''),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['institutions'],
      })
    },
  })

  async function handleRegisterInstitution(data: NewInstitutionSchema) {
    try {
      await registerInstitutionFn({
        name: data.name,
        cnpj: data.cnpj,
        controlStock: data.controlStock,
        type: data.type,
        responsible: data.responsible,
        description: data.description,
      })

      toast({
        title: `Instituição ${data.name} registrada com sucesso!`,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error) {
      const errorMessage = handleApiError(error)

      toast({
        title: 'Não foi possível registrar a Institutição!',
        description: errorMessage,
        variant: 'destructive',
      })
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegisterInstitution)}
          className="grid grid-cols-3 space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Nome da Instituição</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da instituição..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Nome do Responsável pela instituição</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="controlStock"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Controla Estoque</FormLabel>
                  <FormDescription>
                    A instituição irá ter controle de estoque de medicamentos
                    por esse sistema? sim/não
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
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
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tipo de Instituição</FormLabel>
                <SelectInstitutionType
                  onChange={field.onChange}
                  value={field.value}
                />
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
