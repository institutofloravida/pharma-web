'use client'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { fetchManufacturers } from '@/api/pharma/auxiliary-records/manufacturer/fetch-manufacturer'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { DatePickerFormItem } from '@/components/date/date-picker-form-item'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/authContext'
import { cn } from '@/lib/utils'

interface BatchFormProps {
  medicineIndex: number
  batchIndex: number
  onRemove: () => void
  canRemove: boolean
}

export function BatchForm({
  medicineIndex,
  batchIndex,
  onRemove,
  canRemove,
}: BatchFormProps) {
  const { token } = useAuth()
  const form = useFormContext()
  const [queryManufacturer, setQueryManufacturer] = useState('')

  const fieldPrefix = `medicines.${medicineIndex}.batches.${batchIndex}`

  const { data: manufacturersResult, isFetching: isFetchingManufacturers } =
    useQuery({
      queryKey: ['manufacturers', queryManufacturer],
      queryFn: () =>
        fetchManufacturers({ page: 1, query: queryManufacturer }, token ?? ''),
      staleTime: 1000,
      refetchOnMount: true,
    })

  return (
    <div className="grid grid-cols-12 gap-2 rounded p-2">
      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`${fieldPrefix}.code`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Ex: L001" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-3">
        <FormField
          control={form.control}
          name={`${fieldPrefix}.manufacturerId`}
          render={({ field }) => (
            <FormItem className="col-span-3 flex flex-col gap-1">
              <ComboboxUp
                items={manufacturersResult?.manufacturers ?? []}
                field={field}
                query={queryManufacturer}
                placeholder="Selecione o fabricante"
                isFetching={isFetchingManufacturers}
                onQueryChange={setQueryManufacturer}
                getItemText={(item) => item.name}
                onSelect={(id, _) => {
                  form.setValue(`${fieldPrefix}.manufacturerId`, id)
                }}
                itemKey="id"
                formatItem={(item) => {
                  return `${item.name} - ${item.cnpj}`
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`${fieldPrefix}.manufacturingDate`}
          render={({ field }) => (
            <DatePickerFormItem
              className="col-span-3 grid"
              field={field}
              disabled={(date) => date > new Date()}
            />
          )}
        />
      </div>

      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`${fieldPrefix}.expirationDate`}
          render={({ field }) => (
            <DatePickerFormItem
              className="col-span-3 grid"
              field={field}
              disabled={(date) => date < new Date()}
            />
          )}
        />
      </div>

      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`${fieldPrefix}.quantityToEntry`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="number" {...field} min="0" placeholder="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1 flex items-center justify-center">
        {canRemove && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRemove}
            className="h-7 w-7 bg-transparent text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
