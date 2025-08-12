import { PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { UpdateMedicineDialog } from "./update-medicine";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import {
  deleteMedicine,
  type DeleteMedicineBody,
} from "@/api/pharma/medicines/delete-medicine";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";

export interface MedicinesTableRowProps {
  medicine: {
    id: string;
    name: string;
    description: string;
  };
}

export function MedicineTableRow({ medicine }: MedicinesTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: deleteMedicineFn, isPending } = useMutation({
    mutationFn: (data: DeleteMedicineBody) => deleteMedicine(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast({ title: "Medicamento excluído com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir medicamento",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    deleteMedicineFn({ id: medicine.id });
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
        {medicine.name}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicine.description}
      </TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateMedicineDialog
            onSuccess={() => setIsOpen(false)}
            open={isOpen}
            medicineId={medicine.id}
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
            title="Deseja excluir este medicamento?"
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
