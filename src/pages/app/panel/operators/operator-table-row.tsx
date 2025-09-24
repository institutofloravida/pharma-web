import { PenLine, Search, Trash, UserMinus } from "lucide-react";
import { useState } from "react";

import { Operator } from "@/api/pharma/operators/fetch-operators";
import { OperatorRole } from "@/api/pharma/operators/register-operator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { getOperatorRoleTranslation } from "@/lib/utils/translations-mappers/operator-role-translation";

import { UpdateOperatorDialog } from "./update-operator-dialog";
import { useMutation } from "@tanstack/react-query";
import {
  deleteOperator,
  type DeleteOperatorParams,
} from "@/api/pharma/operators/delete-operator";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { useAuth } from "@/contexts/authContext";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogConfirm } from "@/components/dialog/alert-confirm-content";
import { Switch } from "@/components/ui/switch";
import {
  updateOperator,
  type UpdateOperatorBody,
} from "@/api/pharma/operators/update-operator";

export interface OperatorTableRowProps {
  operator: Operator;
}

export function OperatorTableRow({ operator }: OperatorTableRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isActive, setIsActive] = useState(operator.status);
  const { token } = useAuth();

  const { mutateAsync: deleteOperatorFn, isPending } = useMutation({
    mutationFn: (data: DeleteOperatorParams) =>
      deleteOperator(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
      toast({ title: "Operador excluído com sucesso!" });
      setIsDeleteOpen(false);
    },
    onError(error) {
      toast({
        title: "Erro ao excluir Operador",
        description: handleApiError(error),
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteOperatorFn({ operatorId: operator.id });
  };

  //  const { mutateAsync: updateOperatorFn } = useMutation({
  //      mutationFn: (data: UpdateOperatorBody) => updateOperator(data, token ?? ''),
  //      onSuccess() {
  //        queryClient.invalidateQueries({
  //          queryKey: ['operators'],
  //        })
  //      },
  //    })

  //    async function handleUpdateOperator(data: UpdateOperatorSchema) {
  //      try {
  //        await updateOperatorFn({
  //          operatorId,
  //          name: data.name,
  //          email: data.email,
  //          role: data.role ? OperatorRole[data.role] : undefined,
  //          institutionsIds: isSuperAdmin ? [] : data.institutionsIds,
  //        })

  //        toast({
  //          title: `Operador atualizada com sucesso!`,
  //        })
  //      } catch (error) {
  //        const errorMessage = handleApiError(error)
  //        toast({
  //          title: 'Erro ao tentar atualizar a operador.',
  //          description: errorMessage,
  //          variant: 'destructive',
  //        })
  //      }
  //    }

  // const handleStatusChange = (checked: boolean) => {
  //   // Implement status change logic here
  //   setIsActive(checked);
  // };

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
        {operator.name}
      </TableCell>
      <TableCell className="text-muted-foreground">{operator.email}</TableCell>
      <TableCell className="flex-grow flex-col flex-wrap space-x-1 space-y-1">
        {operator.institutions.map((institution, index) => {
          if (index > 1) {
            return <></>;
          }
          return (
            <Badge key={institution.id} variant={"outline"}>
              {institution.name}
            </Badge>
          );
        })}
        {operator.institutions.length > 2 && (
          <Badge variant={"outline"}>...</Badge>
        )}
      </TableCell>
      <TableCell className="font-medium">
        <Badge variant={"secondary"}>
          {getOperatorRoleTranslation(OperatorRole[operator.role])}
        </Badge>
      </TableCell>
      <TableCell>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"xs"}>
              <PenLine className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <UpdateOperatorDialog open={isEditOpen} operatorId={operator.id} />
        </Dialog>
      </TableCell>
      <TableCell>
        <Switch checked={isActive} onCheckedChange={handleStatusChange} />
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
