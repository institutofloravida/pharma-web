import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { getPathology } from "@/api/pharma/auxiliary-records/pathology/get-pathology";
import {
  updatePathology,
  type UpdatePathologyBody,
} from "@/api/pharma/auxiliary-records/pathology/update-pathology";

const updatePathologySchema = z.object({
  code: z.string().trim().min(1).max(10).optional(),
  name: z.string().min(3).optional(),
});
type UpdatePathologySchema = z.infer<typeof updatePathologySchema>;

interface UpdatePathologyProps {
  pathologyId: string;
  open: boolean;
}

export function UpdatePathologyDialog({
  pathologyId,
  open,
}: UpdatePathologyProps) {
  const { token } = useAuth();

  const { data: pathology, isLoading } = useQuery({
    queryKey: ["pathology", pathologyId],
    queryFn: () => getPathology({ id: pathologyId }, token ?? ""),
    enabled: open,
  });

  const form = useForm<UpdatePathologySchema>({
    resolver: zodResolver(updatePathologySchema),
    values: {
      code: pathology?.code ?? "",
      name: pathology?.name ?? "",
    },
  });

  const { mutateAsync: updatePathologyFn } = useMutation({
    mutationFn: (data: UpdatePathologyBody) =>
      updatePathology(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["pathologies"],
      });
    },
  });

  async function handleUpdatePathology(data: UpdatePathologySchema) {
    try {
      await updatePathologyFn({
        pathologyId,
        code: data.code,
        name: data.name,
      });

      toast({
        title: `Patologia atualizada com sucesso!`,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao tentar atualizar a patologia.",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Patologia</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdatePathology)}
          className="grid grid-cols-3 space-y-2"
        >
          {isLoading ? (
            <Skeleton className="col-span-3 h-8" />
          ) : (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>CID</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: E11" {...field} />
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
            </>
          )}

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
        </form>
      </Form>
    </DialogContent>
  );
}
