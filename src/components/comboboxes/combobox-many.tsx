import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
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

interface ComboboxProps<T> {
  items: T[]
  field: {
    value: string[]
  }
  query: string
  placeholder?: string
  placeholderAferSelected?: string
  isFetching: boolean
  onQueryChange: (query: string) => void
  onChange: (selectedItems: string[]) => void
  itemKey: keyof T
  formatItem: (item: T) => string
}

export function ComboboxMany<T extends Record<string, any>>({
  items,
  field,
  query,
  placeholder = 'Selecione itens...',
  placeholderAferSelected = 'item(s) selecionado(s)',
  isFetching,
  onQueryChange,
  onChange,
  itemKey,
  formatItem,
}: ComboboxProps<T>) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    field.value || [],
  )

  const handleAddItem = (id: string) => {
    if (!selectedItems.includes(id)) {
      const newSelectedItems = [...selectedItems, id]
      setSelectedItems(newSelectedItems)
      onChange(newSelectedItems)
    }
  }

  const handleRemoveItem = (id: string) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id)
    setSelectedItems(newSelectedItems)
    onChange(newSelectedItems)
  }

  return (
    <div>
      <Popover>
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
                ? `${selectedItems.length} ${placeholderAferSelected}`
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
                        const itemId = item[itemKey]
                        const isSelected = selectedItems.includes(itemId) // Verifica se o item já está na lista
                        return (
                          <CommandItem
                            value={formattedValue}
                            key={itemId}
                            className={`${isSelected ? 'opacity-50' : ''}`}
                          >
                            {formattedValue}
                            <Button
                              variant="ghost"
                              size="xxs"
                              className="ml-auto"
                              onClick={() => handleAddItem(itemId)}
                              disabled={isSelected} // Desativa o botão se já estiver na lista
                            >
                              <Plus />
                            </Button>
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
      {/* Selected Items Section */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <ul className="grid grid-cols-3 gap-1">
            {selectedItems.map((id) => {
              const selectedItem = items.find((item) => item[itemKey] === id)
              if (!selectedItem) return null

              return (
                <li
                  key={id}
                  className="col-span-1 flex items-center justify-between rounded-md border p-1 text-xs"
                >
                  <span className="">{formatItem(selectedItem)}</span>
                  <Button
                    variant="link"
                    size="xxs"
                    onClick={() => handleRemoveItem(id)}
                  >
                    <X />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
