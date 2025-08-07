import { CheckCircle, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransferModal } from "./components/transfer-modal";
import {
  TransferStatus,
  type TransferDetails,
} from "@/api/pharma/movement/transfer/fetch-transfer";
import { getTransferStatusTranslation } from "@/lib/utils/translations-mappers/status-transfer-translation";
import { confirmTransfer } from "@/api/pharma/movement/transfer/confirm-transfer";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { queryClient } from "@/lib/react-query";

export interface TransferTableRowProps {
  transfer: TransferDetails;
}

export function TransferTableRow({ transfer }: TransferTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { token, institutionId } = useAuth();

  const handleOnConfirm = async (transferId: string) => {
    try {
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
    }
  };

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
            <Dialog>
              <DialogTrigger asChild>
                {transfer.status === "PENDING" && (
                  <Button size="sm" variant="outline" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirmar
                  </Button>
                )}
              </DialogTrigger>
              <TransferModal
                isOpen={true}
                onConfirm={() => handleOnConfirm(transfer.transferId)}
                onClose={() => setIsOpen(false)}
                transferId={transfer.transferId}
              />
            </Dialog>
          )}
      </TableCell>
    </TableRow>
  );
}
