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
  onSelect: (id: string, name: string) => void
  itemKey: keyof T
  itemValue: keyof T
}

export function Combobox<T extends Record<string, any>>({
  items,
  field,
  query,
  placeholder = 'Select an item...',
  isFetching,
  onQueryChange,
  onSelect,
  itemKey,
  itemValue,
}: ComboboxProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-[250px] justify-between',
              !field.value && 'text-muted-foreground',
            )}
          >
            {field.value
              ? items.find((item) => item[itemKey] === field.value)?.[itemValue]
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
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
                    {items.map((item) => (
                      <CommandItem
                        value={item[itemValue]}
                        key={item[itemKey]}
                        onSelect={() =>
                          onSelect(item[itemKey], item[itemValue])
                        }
                      >
                        {item[itemValue]}
                        <Check
                          className={cn(
                            'ml-auto',
                            item[itemKey] === field.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
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
