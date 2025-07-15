import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import type { MovementTypeDirection } from '@/lib/utils/movement-type'

import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

interface OptionDirectionProps {
  value?: MovementTypeDirection
  onChange: (value: MovementTypeDirection) => void
}

export function OptionDirection({ value, onChange }: OptionDirectionProps) {
  return (
    <RadioGroup
      onValueChange={onChange}
      defaultValue={value}
      className="flex flex-col space-y-1"
    >
      <FormItem className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="ENTRY" />
        </FormControl>
        <FormLabel className="font-normal">ENTRADA</FormLabel>
      </FormItem>
      <FormItem className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="EXIT" />
        </FormControl>
        <FormLabel className="font-normal">SAÍDA</FormLabel>
      </FormItem>
    </RadioGroup>
  )
}
