import { PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { UpdateMedicineVariantDialog } from "./update-medicine-variant-dialog";
import { useAuth } from "@/contexts/authContext";
import { useMutation } from "@tanstack/react-query";
import {
  deleteMedicineVariant,
  type DeleteMedicineVariantBody,
} from "@/api/pharma/medicines-variants/delete-medicine-variant";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";

export interface MedicinesVariantsTableRowProps {
  medicineVariant: {
    id: string;
    medicine: string;
    dosage: string;
    unitMeasure: string;
    pharmaceuticalForm: string;
  };
}

export function MedicineVariantTableRow({
  medicineVariant,
}: MedicinesVariantsTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: deleteMedicineVariantFn, isPending } = useMutation({
    mutationFn: (data: DeleteMedicineVariantBody) =>
      deleteMedicineVariant(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["medicineVariants"] });
      toast({ title: "Variante de medicamento excluída com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir variante de medicamento",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    deleteMedicineVariantFn({ id: medicineVariant.id });
  };
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da variante</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails /> */}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineVariant.medicine}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineVariant.dosage} {medicineVariant.unitMeasure}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {medicineVariant.pharmaceuticalForm}
      </TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateMedicineVariantDialog
            open={isOpen}
            medicineVariantId={medicineVariant.id}
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
            title="Deseja excluir esta variante de medicamento?"
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
