import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { updateBatch } from "@/api/pharma/stock/batch/update-batch";
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

const schema = z.object({
  code: z.string().min(1, "Informe o código do lote"),
  expirationDate: z.string().min(1, "Informe a data de validade"),
  manufacturingDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateBatchDialogProps {
  medicineStockId: string;
  batchId: string;
  currentCode: string;
  currentExpirationDate: Date;
  currentManufacturingDate?: Date | null;
}

function toInputDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function UpdateBatchDialog({
  medicineStockId,
  batchId,
  currentCode,
  currentExpirationDate,
  currentManufacturingDate,
}: UpdateBatchDialogProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: currentCode,
      expirationDate: toInputDate(currentExpirationDate),
      manufacturingDate: toInputDate(currentManufacturingDate),
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      updateBatch(
        {
          batchId,
          code: values.code,
          expirationDate: values.expirationDate,
          manufacturingDate: values.manufacturingDate || null,
        },
        token ?? "",
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine-stock", medicineStockId] });
      toast.success("Lote atualizado com sucesso");
      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar o lote");
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
          <DialogTitle>Editar Lote</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do lote</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de validade</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de fabricação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
