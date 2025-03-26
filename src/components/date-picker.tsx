'use client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value?: Date
  onChange: (date?: Date) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - 1919 },
    (_, i) => currentYear - i,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd/MM/yyyy') : 'Selecione uma data'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="day">Dia</Label>
            <Input
              id="day"
              type="number"
              min={1}
              max={31}
              placeholder="Dia"
              className="w-full"
              onChange={(e) => {
                const day = Number.parseInt(e.target.value)
                if (!isNaN(day)) {
                  const newDate = new Date(value || new Date())
                  newDate.setDate(day)
                  onChange(newDate)
                }
              }}
              value={value ? value.getDate() : ''}
            />
          </div>
          <div>
            <Label htmlFor="month">Mês</Label>
            <select
              id="month"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {
                const month = Number.parseInt(e.target.value)
                if (!isNaN(month)) {
                  const newDate = new Date(value || new Date())
                  newDate.setMonth(month)
                  onChange(newDate)
                }
              }}
              value={value ? value.getMonth() : ''}
            >
              <option value="" disabled>
                Mês
              </option>
              <option value="0">Janeiro</option>
              <option value="1">Fevereiro</option>
              <option value="2">Março</option>
              <option value="3">Abril</option>
              <option value="4">Maio</option>
              <option value="5">Junho</option>
              <option value="6">Julho</option>
              <option value="7">Agosto</option>
              <option value="8">Setembro</option>
              <option value="9">Outubro</option>
              <option value="10">Novembro</option>
              <option value="11">Dezembro</option>
            </select>
          </div>
          <div>
            <Label htmlFor="year">Ano</Label>
            <select
              id="year"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {
                const year = Number.parseInt(e.target.value)
                if (!isNaN(year)) {
                  const newDate = new Date(value || new Date())
                  newDate.setFullYear(year)
                  onChange(newDate)
                }
              }}
              value={value ? value.getFullYear() : ''}
            >
              <option value="" disabled>
                Ano
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(date) => onChange(date || undefined)}
            locale={ptBR}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
