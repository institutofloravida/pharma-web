import { TableCell, TableRow } from "@/components/ui/table";

import { Movimentation } from "@/api/pharma/reports/donation-report";
import { Badge } from "@/components/ui/badge";
import {
  dateFormatter,
  dateTimeFormatter,
  fullDateTimeFormatter,
} from "@/lib/utils/formatter";
import { MovementTypeDirection } from "@/lib/utils/movement-type";

export interface MovimentationTableRowProps {
  movimentation: Movimentation;
}

export function MovimentationTableRow({
  movimentation,
}: MovimentationTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">
        {movimentation.stock}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {movimentation.medicine} • {movimentation.dosage}
        {movimentation.unitMeasure} • {movimentation.pharmaceuticalForm}
        {movimentation.complement && `• ${movimentation.complement}`}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <Badge variant="outline">{movimentation.batchCode}</Badge>
      </TableCell>
      <TableCell
        className={`font-mono text-xs font-medium ${movimentation.direction === MovementTypeDirection.ENTRY ? "text-green-500" : "text-red-500"}`}
      >
        {movimentation.direction === MovementTypeDirection.ENTRY
          ? "ENTRADA"
          : "SAÍDA"}
      </TableCell>
      <TableCell
        className={`font-mono text-xs font-medium ${movimentation.direction === MovementTypeDirection.ENTRY ? "text-green-500" : "text-red-500"}`}
      >
        {movimentation.quantity}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <Badge variant={"secondary"}>{movimentation.movementType}</Badge>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {movimentation.operator}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {fullDateTimeFormatter.format(new Date(movimentation.movementDate))}
      </TableCell>
    </TableRow>
  );
}
