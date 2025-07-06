import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import { Gender } from '@/api/pharma/users/fetch-users'
import { Combobox } from '@/components/comboboxes/combobox'
import { DatePicker } from '@/components/date-picker'
import { SelectRole } from '@/components/selects/select-role'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContext'
import { Race } from '@/lib/utils/race'

const unitsmeasureFiltersSchema = z.object({
  name: z.string().optional(),
  sus: z.string().optional(),
  cpf: z.string().optional(),
  birthDate: z.date().optional(),
  generalRegistration: z.string().optional(),
  pathologyId: z.string().optional(),
})

type UnitsMeasureFiltersSchema = z.infer<typeof unitsmeasureFiltersSchema>

export function UserTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  const sus = searchParams.get('sus')
  const cpf = searchParams.get('cpf')
  const birthDate = searchParams.get('birthDate')
  const generalRegistration = searchParams.get('generalRegistration')
  const pathologyId = searchParams.get('pathologyId')

  const form = useForm<UnitsMeasureFiltersSchema>({
    resolver: zodResolver(unitsmeasureFiltersSchema),
    defaultValues: {
      name: name ?? '',
      sus: sus ?? '',
      cpf: cpf ?? '',
      birthDate: birthDate ? new Date(birthDate) : undefined,
      pathologyId: pathologyId ?? '',
      generalRegistration: generalRegistration || undefined,
    },
  })

  function handleFilter({
    name,
    sus,
    cpf,
    birthDate,
    pathologyId,
    generalRegistration,
  }: UnitsMeasureFiltersSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }

      if (sus) {
        state.set('sus', sus)
      } else {
        state.delete('sus')
      }

      if (cpf) {
        state.set('cpf', cpf)
      } else {
        state.delete('cpf')
      }

      if (birthDate) {
        state.set('birthDate', birthDate.toISOString())
      } else {
        state.delete('birthDate')
      }

      if (pathologyId) {
        state.set('pathologyId', pathologyId)
      } else {
        state.delete('pathologyId')
      }

      if (generalRegistration) {
        state.set('generalRegistration', generalRegistration)
      } else {
        state.delete('generalRegistration')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('name')
      state.delete('sus')
      state.delete('cpf')
      state.delete('birthDate')
      state.delete('pathologyId')
      state.delete('generalRegistration')
      state.set('page', '1')

      return state
    })

    form.reset({
      name: '',
      birthDate: undefined,
      cpf: '',
      generalRegistration: '',
      pathologyId: '',
      sus: '',
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-10 grid-rows-2 gap-1 space-x-2 p-2"
        onSubmit={form.handleSubmit(handleFilter)}
      >
        <span className="text-sm font-semibold">Filtros:</span>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-5 h-8">
              <FormControl>
                <Input placeholder="Nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <InputMask
                  {...field}
                  mask="999.999.999-99"
                  placeholder="CPF..."
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
          name="sus"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <InputMask
                  {...field}
                  mask="99999.99999.99999"
                  placeholder="SUS..."
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
          name="generalRegistration"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <Input placeholder="RG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={'secondary'}
          size={'xs'}
          className="col-span-2 flex justify-between"
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          className="col-span-2 flex justify-between"
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
