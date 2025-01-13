import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/auxiliary-records/institution/fetch-institutions'
import {
  ComboboxMany,
  ComboboxMultiSelect,
} from '@/components/comboboxes/combobox-many'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'

const newOperatorSchema = z.object({
  intitutionsIds: z.array(z.string()),
})

type NewOperatorSchema = z.infer<typeof newOperatorSchema>

export function Test() {
  const { token } = useAuth()
  const [queryInstitution, setQueryInstitution] = useState('')

  const form = useForm<NewOperatorSchema>({
    resolver: zodResolver(newOperatorSchema),
  })

  const { data: institutionsResult, isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => fetchInstitutions({ page: 1 }, token ?? ''),
  })

  async function handleRegisterOperator(data: NewOperatorSchema) {
    try {
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
    <div className="flex h-full items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegisterOperator)}>
          {/* <FormField
            control={form.control}
            name="intitutionsIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instituições</FormLabel>
                <ComboboxMany
                  field={field}
                  items={institutions ?? []}
                  itemKey="id"
                  onChange={(selectedItems) => field.onChange(selectedItems)}
                  onQueryChange={setQueryInstitution}
                  query={queryInstitution}
                  isFetching={isLoading}
                  formatItem={(item) => `${item.name}`}
                />
              </FormItem>
            )}
          /> */}
          <Separator className="m-2" />
          <Button variant={'ghost'}>Cancelar</Button>
          <Button type="submit">Cadastrar</Button>
        </form>
      </Form>
    </div>
  )
}
