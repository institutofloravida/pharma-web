import { ExitType } from "@/api/pharma/movement/exit/register-medicine-exit";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectExitTypeProps {
  value?: ExitType;
  includeDispensation?: boolean;
  onChange: (value: ExitType) => void;
}

export function SelectExitType({
  value,
  onChange,
  includeDispensation = false,
}: SelectExitTypeProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {includeDispensation && (
          <SelectItem value={ExitType.DISPENSATION}>Dispensa</SelectItem>
        )}
        <SelectItem value={ExitType.EXPIRATION}>Vencimento</SelectItem>
        <SelectItem value={ExitType.DONATION}>Doação</SelectItem>
        <SelectItem value={ExitType.TRANSFER}>Transferência</SelectItem>
        <SelectItem value={ExitType.MOVEMENT_TYPE}>Outro</SelectItem>
      </SelectContent>
    </Select>
  );
}
