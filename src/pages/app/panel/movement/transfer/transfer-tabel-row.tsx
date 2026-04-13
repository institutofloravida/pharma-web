import { CheckCircle, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransferModal } from "./components/transfer-modal";
import {
  TransferStatus,
  type TransferDetails,
} from "@/api/pharma/movement/transfer/fetch-transfer";
import { getTransferStatusTranslation } from "@/lib/utils/translations-mappers/status-transfer-translation";
import { confirmTransfer } from "@/api/pharma/movement/transfer/confirm-transfer";
import { cancelTransfer } from "@/api/pharma/movement/transfer/cancel-transfer";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { queryClient } from "@/lib/react-query";

export interface TransferTableRowProps {
  transfer: TransferDetails;
}

export function TransferTableRow({ transfer }: TransferTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { token, institutionId } = useAuth();
  const navigate = useNavigate();

  const handleOnConfirm = async (transferId: string) => {
    try {
      setIsConfirming(true);
      await confirmTransfer({ transferId }, token ?? "");
      queryClient.invalidateQueries({
        queryKey: ["transfers"],
      });
      setIsOpen(false);

      toast({
        title: "Transferência confirmada com sucesso!",
        description: "Os medicamentos já foram atualizados no estoque",
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao confirmar transferência",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleOnCancel = async (transferId: string) => {
    try {
      setIsCancelling(true);
      await cancelTransfer({ transferId }, token ?? "");
      queryClient.invalidateQueries({
        queryKey: ["transfers"],
      });
      toast({
        title: "Transferência recusada com sucesso!",
        description: "Os medicamentos foram devolvidos ao estoque de origem.",
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao recusar transferência",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Button
          variant="outline"
          size="xs"
          onClick={() => navigate(`/movement/transfer/${transfer.transferId}`)}
        >
          <Search className="h-3 w-3" />
          <span className="sr-only">Detalhes da transferência</span>
        </Button>
      </TableCell>
      <TableCell>
        {new Date(transfer.transferDate).toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{transfer.institutionOrigin}</div>
          <div className="text-sm text-muted-foreground">
            {transfer.stockOrigin}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{transfer.institutionDestination}</div>
          <div className="text-sm text-muted-foreground">
            {transfer.stockDestination}
          </div>
        </div>
      </TableCell>
      <TableCell>{transfer.operator}</TableCell>
      <TableCell>
        {" "}
        <Badge
          variant={
            transfer.status === "CONFIRMED"
              ? "default"
              : transfer.status === "CANCELED"
                ? "destructive"
                : "warning"
          }
        >
          {getTransferStatusTranslation(transfer.status)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {transfer.status === TransferStatus.PENDING &&
          transfer.institutionDestinationId === institutionId && (
            <div className="flex items-center justify-end gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    disabled={isCancelling}
                  >
                    <XCircle className="h-4 w-4" />
                    Recusar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogConfirm
                  title="Recusar transferência?"
                  description="Os medicamentos serão devolvidos ao estoque de origem. Esta ação não pode ser desfeita."
                  isPending={isCancelling}
                  variant="destructive"
                  cancelLabel="Cancelar"
                  confirmLabel="Recusar"
                  onConfirm={() => handleOnCancel(transfer.transferId)}
                />
              </AlertDialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirmar
                  </Button>
                </DialogTrigger>
                <TransferModal
                  isOpen={true}
                  onConfirm={() => handleOnConfirm(transfer.transferId)}
                  onClose={() => setIsOpen(false)}
                  transferId={transfer.transferId}
                  isConfirming={isConfirming}
                />
              </Dialog>
            </div>
          )}
      </TableCell>
    </TableRow>
  );
}
