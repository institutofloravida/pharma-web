import { PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Formatter } from "@/lib/utils/formaters/formaters";

import { UpdateManufacturerDialog } from "./update-manufacturer-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";
import { useMutation } from "@tanstack/react-query";
import {
  deleteManufacturer,
  type DeleteManufacturerBody,
} from "@/api/pharma/auxiliary-records/manufacturer/delete-manufacturer";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { useAuth } from "@/contexts/authContext";

export interface ManufacturerTableRowProps {
  manufacturer: {
    id: string;
    name: string;
    cnpj: string;
    description?: string;
  };
}

export function ManufacturerTableRow({
  manufacturer,
}: ManufacturerTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: deleteManufacturerFn, isPending } = useMutation({
    mutationFn: (data: DeleteManufacturerBody) =>
      deleteManufacturer(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      toast({ title: "Fabricante excluído com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir fabricante",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    deleteManufacturerFn({ id: manufacturer.id });
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
        {manufacturer.name}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {Formatter.cnpj(manufacturer.cnpj)}
      </TableCell>
      <TableCell>{manufacturer.description}</TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateManufacturerDialog
            open={isOpen}
            manufacturerId={manufacturer.id}
            onSuccess={() => setIsOpen(false)}
          />
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
            title="Deseja excluir este fabricante?"
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
