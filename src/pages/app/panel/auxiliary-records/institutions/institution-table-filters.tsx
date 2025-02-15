import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const institutionsFiltersSchema = z.object({
  query: z.string().optional(),
  cnpj: z
    .string()
    .optional()
    .superRefine((value, ctx) => {
      if (value && value.length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O CNPJ deve ter exatamente 14 dígitos.',
        })
      }
    }),
})

type InstitutionsFiltersSchema = z.infer<typeof institutionsFiltersSchema>

export function InstitutionTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('query')
  const cnpj = searchParams.get('cnpj')

  const form = useForm<InstitutionsFiltersSchema>({
    resolver: zodResolver(institutionsFiltersSchema),
    defaultValues: {
      cnpj: cnpj ?? '',
      query: query ?? '',
    },
  })

  function hanldeFilter({ cnpj, query }: InstitutionsFiltersSchema) {
    setSearchParams((state) => {
      if (query) {
        state.set('query', query)
      } else {
        state.delete('query')
      }

      if (cnpj) {
        state.set('cnpj', cnpj)
      } else {
        state.delete('cnpj')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('query')
      state.delete('cnpj')
      state.set('page', '1')

      return state
    })

    form.reset({
      cnpj: '',
      query: '',
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-2"
        onSubmit={form.handleSubmit(hanldeFilter)}
      >
        <span className="text-sm font-semibold">Filtros:</span>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="h-8 w-auto">
              <FormControl>
                <Input placeholder="Nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem className="h-8 w-auto">
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
        <Button type="submit" variant={'secondary'} size={'xs'}>
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          onClick={handleClearFilters}
          type="button"
          variant={'outline'}
          size={'xs'}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
      </form>
    </Form>
  )
}
