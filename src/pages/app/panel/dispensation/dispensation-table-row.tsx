import { PenLine, RotateCcw, Search, Trash } from "lucide-react";

import { Dispensation } from "@/api/pharma/dispensation/fetch-dispensations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { dateFormatter } from "@/lib/utils/formatter";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useMutation } from "@tanstack/react-query";
import {
  reverseExit,
  type ReverseExitParams,
} from "@/api/pharma/movement/exit/reverse-exit";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";

export interface DispensationsTableRowProps {
  dispensation: Dispensation;
}

export function DispensationTableRow({
  dispensation,
}: DispensationsTableRowProps) {
  const [isReverseOpen, setIsReverseOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: reverseExitFn, isPending: isPendingReverse } =
    useMutation({
      mutationFn: (data: ReverseExitParams) => reverseExit(data, token ?? ""),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["dispensations"] });
        toast({ title: "Dispensa revertida com sucesso!" });
        setIsReverseOpen(false);
      },
      onError(error) {
        toast({
          title: "Erro ao reverter dispensa",
          description: handleApiError(error),
          variant: "destructive",
        });
      },
    });
  const handleReverse = () => {
    reverseExitFn({ exitId: dispensation.exitId });
  };
  return (
    <TableRow
      aria-disabled={dispensation.reversedAt !== null}
      className={`${dispensation.reversedAt !== null ? "opacity-50" : ""}`}
    >
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dispensation.patient}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dispensation.operator}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dateFormatter.format(new Date(dispensation.dispensationDate))}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {dispensation.items}
      </TableCell>

      <TableCell className="flex-col items-center justify-center gap-2 align-middle font-mono text-xs font-medium">
        {dispensation.reversedAt && (
          <Badge variant={"outline"}>Revertido</Badge>
        )}
        <p className="text-xs text-muted-foreground">
          {dispensation.reversedAt &&
            dateFormatter.format(new Date(dispensation.reversedAt))}
        </p>
      </TableCell>
      <TableCell className="">
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
                        isPendingReverse ||
                        (dispensation.reversedAt !== null &&
                          dispensation.reversedAt !== undefined)
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
              title="Deseja reverter essa Dispensa?"
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
