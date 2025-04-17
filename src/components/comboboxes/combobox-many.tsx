import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    value: { id: string; value: string }[]
  }
  query: string
  placeholder?: string
  placeholderAferSelected?: string
  isFetching: boolean
  onQueryChange: (query: string) => void
  onChange: (selectedItems: { id: string; value: string }[]) => void
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
  const [selectedItems, setSelectedItems] = useState<
    { id: string; value: string }[]
  >(field.value || [])

  useEffect(() => {
    setSelectedItems(field.value || [])
  }, [field.value])

  const handleAddItem = (item: T) => {
    const newItem = { id: item[itemKey], value: formatItem(item) }
    if (!selectedItems.some((selected) => selected.id === newItem.id)) {
      const newSelectedItems = [...selectedItems, newItem]
      setSelectedItems(newSelectedItems)
      onChange(newSelectedItems) // Atualiza o formulário
    }
  }
  const handleRemoveItem = (id: string) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== id)
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
                'w-[250px] justify-between bg-transparent',
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
                        const isSelected = selectedItems.some(
                          (selected) => selected.id === itemId,
                        )

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
                              onClick={() => handleAddItem(item)}
                              disabled={isSelected}
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
        <div
          className="mt-4"
          style={{
            borderRadius: '16px',
            padding: '1rem',
            border: '0.4px dotted #ccc1 ',
          }}
        >
          <ul className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {selectedItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded border p-1"
                style={{
                  flex: '1 1 auto', // Tamanho automático baseado no conteúdo
                  maxWidth: '100%', // Permite que o item ocupe a linha toda se necessário
                }}
              >
                <span>{item.value}</span>
                <Button
                  variant="link"
                  size="xxxs"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
