import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl } from '@/components/ui/form'
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
  }
  query: string
  placeholder?: string
  isFetching: boolean
  onQueryChange: (query: string) => void
  onSelect: (id: string, formattedValue: string) => void
  itemKey: keyof T
  formatItem: (item: T) => string
}

export function ComboboxUp<T extends Record<string, any>>({
  items,
  field,
  query,
  placeholder = 'Select an item...',
  isFetching,
  onQueryChange,
  onSelect,
  itemKey,
  formatItem,
}: ComboboxProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'justify-between bg-transparent',
              !field.value && 'text-muted-foreground',
            )}
          >
            {field.value
              ? (() => {
                  const selectedItem = items.find((item) => {
                    return item[itemKey] === field.value
                  })

                  if (!selectedItem) {
                    return 'Item não encontrado'
                  }
                  return formatItem(selectedItem as T)
                })()
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={query}
            onValueChange={onQueryChange}
          />
          <CommandList>
            {isFetching && <CommandEmpty>Loading...</CommandEmpty>}
            {!isFetching && (
              <>
                {items.length ? (
                  <CommandGroup>
                    {items.map((item) => {
                      const formattedValue = formatItem(item)
                      return (
                        <CommandItem
                          value={formattedValue}
                          key={item[itemKey]}
                          onSelect={() =>
                            onSelect(item[itemKey], formattedValue)
                          }
                        >
                          {formattedValue}
                          <Check
                            className={cn(
                              'ml-auto',
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
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
