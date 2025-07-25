import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerFormItemProps {
  field: {
    value: Date | undefined
    onChange: (date: Date | undefined) => void
    name: string
    ref?: React.Ref<any>
  }
  placeholder?: string
  className?: string
  label?: string
  disabled?: (date: Date) => boolean
}

export function DatePickerFormItem({
  field,
  placeholder = 'Selecione a data',
  className,
  disabled,
  label,
}: DatePickerFormItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <FormItem className={`${className}`}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                `bg-transparent pl-3 text-left font-normal`,
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? (
                format(field.value, 'dd/MM/yyyy', { locale: ptBR })
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={ptBR}
            className="bg-transparent"
            mode="single"
            selected={field.value}
            onSelect={(date) => {
              field.onChange(date)
              setOpen(false)
            }}
            disabled={disabled}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )
}
