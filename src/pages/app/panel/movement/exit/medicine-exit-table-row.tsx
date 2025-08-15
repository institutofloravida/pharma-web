import { FileText, PenLine, RotateCcw, Search, Trash } from "lucide-react";
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
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";
import { useAuth } from "@/contexts/authContext";
import {
  reverseExit,
  type ReverseExitParams,
} from "@/api/pharma/movement/exit/reverse-exit";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { handleApiError } from "@/lib/utils/handle-api-error";

export interface MedicinesExitsTableRowProps {
  medicineExit: MedicineExit;
}

export function MedicineExitTableRow({
  medicineExit,
}: MedicinesExitsTableRowProps) {
  const { downloadPdf } = useDonationReportPdf();
  const [loading, setLoading] = useState(false);
  const [isReverseOpen, setIsReverseOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: reverseExitFn, isPending: isPendingReverse } =
    useMutation({
      mutationFn: (data: ReverseExitParams) => reverseExit(data, token ?? ""),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["medicines-exits"] });
        toast({ title: "Saída revertida com sucesso!" });
        setIsReverseOpen(false);
      },
      onError(error) {
        toast({
          title: "Erro ao reverter saída",
          description: handleApiError(error),
          variant: "destructive",
        });
      },
    });
  const handleReverse = () => {
    reverseExitFn({ exitId: medicineExit.id });
  };
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
      <TableCell className="flex-col items-center justify-center gap-2 align-middle font-mono text-xs font-medium">
        {medicineExit.reverseAt && <Badge variant={"outline"}>Revertido</Badge>}
        <p className="text-xs text-muted-foreground">
          {medicineExit.reverseAt &&
            dateFormatter.format(new Date(medicineExit.reverseAt))}
        </p>
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
                    loading ||
                    !(medicineExit.exitType === ExitType.DONATION) ||
                    medicineExit.reverseAt !== null
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
        <AlertDialog open={isReverseOpen} onOpenChange={setIsReverseOpen}>
          <TooltipProvider>
            <div className="">
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"xs"}
                      disabled={
                        loading ||
                        (medicineExit.reverseAt !== null &&
                          medicineExit.reverseAt !== undefined)
                      }
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-primary-foreground">
                  <p>Reverter</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <AlertDialogConfirm
              title="Deseja reverter essa saída?"
              description="Esta ação não pode ser desfeita. Todos os itens serão devolvidos ao estoque."
              isPending={isPendingReverse}
              variant="destructive"
              cancelLabel="Cancelar"
              confirmLabel="Reverter"
              onConfirm={handleReverse}
            />
          </TooltipProvider>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
