import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

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

interface ComboboxMultiSelectProps<T> {
  items: T[]
  selectedItems: T[]
  query: string
  placeholder?: string
  isFetching: boolean
  onQueryChange: (query: string) => void
  onSelect: (selectedItems: T[]) => void
  itemKey: keyof T
  formatItem: (item: T) => string
}

export function ComboboxMultiSelect<T extends Record<string, any>>({
  items,
  selectedItems,
  query,
  placeholder = 'Select items...',
  isFetching,
  onQueryChange,
  onSelect,
  itemKey,
  formatItem,
}: ComboboxMultiSelectProps<T>) {
  const [open, setOpen] = useState(false)

  const toggleSelection = (item: T) => {
    const isAlreadySelected = selectedItems.some(
      (selected) => selected[itemKey] === item[itemKey],
    )

    const updatedSelection = isAlreadySelected
      ? selectedItems.filter((selected) => selected[itemKey] !== item[itemKey])
      : [...selectedItems, item]

    onSelect(updatedSelection)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-[250px] justify-between',
              !selectedItems.length && 'text-muted-foreground',
            )}
          >
            {selectedItems.length
              ? selectedItems.map(formatItem).join(', ')
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
                    {items.map((item) => {
                      const formattedValue = formatItem(item)
                      const isSelected = selectedItems.some(
                        (selected) => selected[itemKey] === item[itemKey],
                      )

                      return (
                        <CommandItem
                          value={formattedValue}
                          key={item[itemKey]}
                          onSelect={() => toggleSelection(item)}
                        >
                          {formattedValue}
                          <Check
                            className={cn(
                              'ml-auto',
                              isSelected ? 'opacity-100' : 'opacity-0',
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
