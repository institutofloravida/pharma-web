import { PenLine, Search, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { UpdateUnitMeasureDialog } from "./update-unit-measure";
import { useAuth } from "@/contexts/authContext";
import {
  deleteUnitMeasure,
  type DeleteUnitMeasureBody,
} from "@/api/pharma/auxiliary-records/unit-measure/delete-unit-measure";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { useMutation } from "@tanstack/react-query";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";

export interface UnitMeasureTableRowProps {
  unitMeasure: {
    id: string;
    name: string;
    acronym: string;
  };
}

export function UnitMeasureTableRow({ unitMeasure }: UnitMeasureTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { token } = useAuth();

  const { mutateAsync: deleteUnitMeasureFn, isPending } = useMutation({
    mutationFn: (data: DeleteUnitMeasureBody) =>
      deleteUnitMeasure(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["units-measure"] });
      toast({ title: "Unidade de medida excluída com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir unidade de medida",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });
  const handleDelete = () => {
    deleteUnitMeasureFn({ id: unitMeasure.id });
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
        {unitMeasure.name}
      </TableCell>

      <TableCell>{unitMeasure.acronym}</TableCell>

      <TableCell>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateUnitMeasureDialog
            open={isOpen}
            unitMeasureId={unitMeasure.id}
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
            title="Deseja excluir esta unidade de medida?"
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
