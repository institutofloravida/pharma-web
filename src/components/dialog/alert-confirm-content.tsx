import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AlertDialogConfirmProps {
  title: string;
  description?: string;
  isPending?: boolean;
  variant?: "destructive" | "default";
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export function AlertDialogConfirm({
  title,
  description,
  isPending = false,
  variant = "destructive",
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  onConfirm,
}: AlertDialogConfirmProps) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>
          {cancelLabel}
        </AlertDialogCancel>
        <Button variant={variant} onClick={onConfirm} disabled={isPending}>
          {confirmLabel}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
