import { Check, ChevronsUpDown } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ComboboxProps<T> {
  items: T[]
  field: {
    value: string
    onChange: (value: string) => void
  }
  query: string
  placeholder?: string
  isFetching: boolean
  onQueryChange: (query: string) => void
  onSelect: (id: string, item: T) => void
  itemKey: keyof T
  itemValue?: keyof T
  formatItem: (item: T) => ReactNode
  getItemText?: (item: T) => string
}

export function Combobox<T extends Record<string, any>>({
  items,
  field,
  query,
  placeholder = 'Selecione...',
  isFetching,
  onQueryChange,
  onSelect,
  itemKey,
  itemValue,
  formatItem,
  getItemText = (item) => String(item[itemKey]),
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between bg-transparent',
            !field.value && 'text-muted-foreground',
          )}
        >
          {field.value
            ? (() => {
                const selectedItem = items.find(
                  (item) => item[itemKey] === field.value,
                )
                return selectedItem
                  ? formatItem(selectedItem)
                  : 'Item não encontrado'
              })()
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar..."
            className="h-9"
            value={query}
            onValueChange={onQueryChange}
          />
          <CommandList>
            {isFetching && <CommandEmpty>Carregando...</CommandEmpty>}
            {!isFetching && (
              <>
                {items.length ? (
                  <CommandGroup>
                    {items.map((item) => {
                      const itemText = getItemText(item)
                      return (
                        <CommandItem
                          key={item[itemKey]}
                          value={itemText}
                          onSelect={() => {
                            field.onChange(item[itemKey]) // atualiza valor do formulário
                            onSelect(item[itemKey], item) // callback externo
                            setOpen(false) // fecha o popover
                          }}
                        >
                          {formatItem(item)}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              item[itemKey] === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>Nenhum resultado.</CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
