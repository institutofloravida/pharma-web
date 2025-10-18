import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchInstitutions } from "@/api/pharma/auxiliary-records/institution/fetch-institutions";
import { getStockDetails } from "@/api/pharma/auxiliary-records/stock/get-stock-details";
import {
  updateStock,
  type UpdateStockBody,
} from "@/api/pharma/auxiliary-records/stock/update-stock";
import { SelectInstitutions } from "@/components/selects/select-institutions";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { handleApiError } from "@/lib/utils/handle-api-error";

const updateStockSchema = z.object({
  name: z
    .string({
      required_error: "prencha o campo",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  status: z.boolean(),
  institutionId: z.string(),
});
type UpdateStockSchema = z.infer<typeof updateStockSchema>;

interface UpdateStockProps {
  stockId: string;
  open: boolean;
}

export function UpdateStockDialog({ stockId, open }: UpdateStockProps) {
  const { token } = useAuth();

  const { data: stock, isLoading } = useQuery({
    queryKey: ["stock", stockId],
    queryFn: () => getStockDetails({ id: stockId }, token ?? ""),
    enabled: open,
  });

  const { data: institutionsResult } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetchInstitutions({ page: 1 }, token ?? ""),
  });

  const form = useForm<UpdateStockSchema>({
    resolver: zodResolver(updateStockSchema),
    values: {
      name: stock?.name ?? "",
      status: stock?.status ?? true,
      institutionId: stock?.institutionId ?? "",
    },
  });

  const { mutateAsync: updateStockFn } = useMutation({
    mutationFn: (data: UpdateStockBody) => updateStock(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["stocks"],
      });
    },
  });

  async function handleUpdateStock(data: UpdateStockSchema) {
    try {
      await updateStockFn({
        stockId,
        name: data.name,
      });

      toast({
        title: `Estoque atualizado com sucesso!`,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao tentar atualizar o estoque.",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Estoque</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateStock)}
          className="grid grid-cols-3 space-y-2"
        >
          {isLoading ? (
            <Skeleton className="col-span-3 h-8" />
          ) : (
            <>
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Instituição</FormLabel>
                    <FormControl>
                      <SelectInstitutions
                        institutions={institutionsResult?.institutions ?? []}
                        value={field.value}
                        isDisabled
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="col-span-3 grid justify-end">
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant={"ghost"}>Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Atualizar
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </form>
      </Form>
    </DialogContent>
  );
}
