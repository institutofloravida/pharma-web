import { FileText, PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { MedicineExit } from "@/api/pharma/movement/exit/fetch-medicines-exits";
import { ExitType } from "@/api/pharma/movement/exit/register-medicine-exit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dateFormatter } from "@/lib/utils/formatter";
import { useDonationReportPdf } from "@/pages/app/reports/donation-report/use-donation-report";
import { getExitTypeTranslation } from "@/lib/utils/translations-mappers/exit-type-translation";

export interface MedicinesExitsTableRowProps {
  medicineExit: MedicineExit;
}

export function MedicineExitTableRow({
  medicineExit,
}: MedicinesExitsTableRowProps) {
  const { downloadPdf } = useDonationReportPdf();
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      await downloadPdf(medicineExit.id);
    } finally {
      setLoading(false);
    }
  }
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da saída</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.stock}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.operator}
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {medicineExit.items}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        <Badge variant="secondary">
          {getExitTypeTranslation(medicineExit.exitType)}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(medicineExit.exitDate))}
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <div className="">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"xs"}
                  disabled={
                    loading || !(medicineExit.exitType === ExitType.DONATION)
                  }
                  onClick={handleDownload}
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-primary text-primary-foreground">
                <p>Termo de Doação</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <Button variant={"outline"} size={"xs"}>
          <Trash className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
