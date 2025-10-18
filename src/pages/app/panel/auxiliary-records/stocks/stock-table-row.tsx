import { PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { UpdateStockDialog } from "./update-stock-dialog";
import { useMutation } from "@tanstack/react-query";
import {
  activateStock,
  type ActivateStockParams,
} from "@/api/pharma/auxiliary-records/stock/activate-stock";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import {
  deactivateStock,
  type DeactivateStockParams,
} from "@/api/pharma/auxiliary-records/stock/deactivate-stock";
import { useAuth } from "@/contexts/authContext";
import { Switch } from "@/components/ui/switch";
import { set } from "date-fns";
import {
  deleteStock,
  type DeleteStockParams,
} from "@/api/pharma/auxiliary-records/stock/delete-stock";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";

export interface StockTableRowProps {
  stock: {
    id: string;
    name: string;
    status: boolean;
    institutionName: string;
  };
}

export function StockTableRow({ stock }: StockTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(stock.status);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: deleteStockFn, isPending } = useMutation({
    mutationFn: (data: DeleteStockParams) => deleteStock(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast({ title: "Estoque excluído com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir Estoque",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteStockFn({ stockId: stock.id });
  };

  const { mutateAsync: activateStockFn } = useMutation({
    mutationFn: (data: ActivateStockParams) => activateStock(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["stocks"],
      });
    },
  });

  async function handleActivateStock(data: ActivateStockParams) {
    try {
      await activateStockFn({
        stockId: data.stockId,
      });
      toast({
        title: `Estoque ativado com sucesso!`,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setIsActive(false);
      toast({
        title: "Erro ao tentar ativar o estoque.",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  const { mutateAsync: deactivateStockFn } = useMutation({
    mutationFn: (data: DeactivateStockParams) =>
      deactivateStock(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["stocks"],
      });
    },
  });

  async function handleDeactivateStock(data: DeactivateStockParams) {
    try {
      await deactivateStockFn({
        stockId: data.stockId,
      });
      toast({
        title: `Estoque desativado com sucesso!`,
      });
    } catch (error) {
      setIsActive(true);
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao tentar desativar o estoque.",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  const handleStatusChange = (checked: boolean) => {
    if (checked) {
      handleActivateStock({ stockId: stock.id });
    } else {
      handleDeactivateStock({ stockId: stock.id });
    }
    setIsActive(checked);
  };

  return (
    <TableRow>
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
        {stock.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2">
          {stock.status ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-muted-foreground">ATIVO</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="font-medium text-muted-foreground">INATIVO</span>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>{stock.institutionName}</TableCell>
      <TableCell>
        <Switch checked={isActive} onCheckedChange={handleStatusChange} />
      </TableCell>
      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateStockDialog open={isOpen} stockId={stock.id} />
        </Dialog>
      </TableCell>
      <TableCell>
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Trash className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogConfirm
            title="Deseja excluir este operador?"
            description="Esta ação não pode ser desfeita."
            isPending={isPending}
            variant="destructive"
            cancelLabel="Cancelar"
            confirmLabel="Excluir"
            onConfirm={handleDelete}
          />
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
