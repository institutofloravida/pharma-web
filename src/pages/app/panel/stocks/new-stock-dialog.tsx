import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/fetch-institutions'
import { registerStock, type RegisterStockBody } from '@/api/register-stock'
import { SelectInstitutions } from '@/components/select-institutions'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'prencha o campo',
    })
    .min(2, {
      message: 'Username must be at least 2 characters.',
    }),
  status: z.boolean(),
  institutionId: z.string(),
})
type NewStockSchema = z.infer<typeof FormSchema>

export function NewStockDialog() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: institutions } = useQuery({
    queryKey: ['institutions', page],
    queryFn: () => fetchInstitutions({ page }, token ?? ''),
  })

  const { mutateAsync: registerStockFn } = useMutation({
    mutationFn: (data: RegisterStockBody) => registerStock(data, token ?? ''),
    onSuccess(_, { name, institutionId, status }) {
      const cached =
        queryClient.getQueryData<NewStockSchema[]>(['stocks']) || []
      console.log('cached>>>>>>', cached)
      if (cached) {
        queryClient.setQueryData(
          ['stocks'],
          [{ name, institutionId, status }, ...cached],
        )
      }
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: true,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await registerStockFn({
        name: data.name,
        institutionId: data.institutionId,
        status: data.status,
      })

      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error) {
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Estoque</DialogTitle>
        <DialogDescription>Cadastre seu novo estoque.</DialogDescription>
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
                  <Input placeholder="Nome do estoque..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Status</FormLabel>
                  <FormDescription>
                    Defina o status do seu estoque.
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
            name="institutionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instituição</FormLabel>
                <FormControl>
                  <SelectInstitutions
                    institutions={institutions ?? []}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  )
}
