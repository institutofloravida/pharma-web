import { PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { UpdatePharmaceuticalFormDialog } from "./update-pharmaceutical-form-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";
import {
  deletePharmaceuticalForm,
  type DeletePharmaceuticalFormBody,
} from "@/api/pharma/auxiliary-records/pharmaceutical-form/delete-pharmaceutical-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { useAuth } from "@/contexts/authContext";

export interface PharmaceuticalFormTableRowProps {
  pharmaceuticalForm: {
    id: string;
    name: string;
  };
}

export function PharmaceuticalFormTableRow({
  pharmaceuticalForm,
}: PharmaceuticalFormTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: deletePharmaceuticalFormFn, isPending } = useMutation({
    mutationFn: (data: DeletePharmaceuticalFormBody) =>
      deletePharmaceuticalForm(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["pharmaceutical-forms"] });
      toast({ title: "Forma Farmacêutica excluída com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir forma farmacêutica",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    deletePharmaceuticalFormFn({ id: pharmaceuticalForm.id });
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
        {pharmaceuticalForm.name}
      </TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdatePharmaceuticalFormDialog
            open={isOpen}
            pharmaceuticalformId={pharmaceuticalForm.id}
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
            title="Deseja excluir esta forma farmacêutica?"
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
