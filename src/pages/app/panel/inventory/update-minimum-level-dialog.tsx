import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { updateMedicineStockMinimumLevel } from "@/api/pharma/inventory/update-medicine-stock-minimum-level";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authContext";
import { Pencil } from "lucide-react";

const schema = z.object({
  minimumLevel: z.coerce
    .number({ invalid_type_error: "Informe um número válido" })
    .int("Deve ser um número inteiro")
    .min(0, "Deve ser 0 ou maior"),
});

type FormValues = z.infer<typeof schema>;

interface UpdateMinimumLevelDialogProps {
  medicineStockId: string;
  currentMinimumLevel: number;
}

export function UpdateMinimumLevelDialog({
  medicineStockId,
  currentMinimumLevel,
}: UpdateMinimumLevelDialogProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { minimumLevel: currentMinimumLevel },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      updateMedicineStockMinimumLevel(
        { medicineStockId, minimumLevel: values.minimumLevel },
        token ?? "",
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine-stock", medicineStockId] });
      toast.success("Nível mínimo atualizado com sucesso");
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar o nível mínimo");
    },
  });

  function onSubmit(values: FormValues) {
    mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar Nível Mínimo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="minimumLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível mínimo</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
