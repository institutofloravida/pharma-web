import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  registerTherapeuticClass,
  type RegisterTherapeuticClassBody,
} from "@/api/pharma/auxiliary-records/therapeutic-class/register-therapeutic-class";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { handleApiError } from "@/lib/utils/handle-api-error";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "prencha o campo",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  description: z.string().optional(),
});
type NewTherapeuticClassSchema = z.infer<typeof FormSchema>;

interface NewTherapeuticClassDialogProps {
  onSuccess?: () => void;
}

export function NewTherapeuticClassDialog({
  onSuccess,
}: NewTherapeuticClassDialogProps) {
  const { token } = useAuth();

  const { mutateAsync: registerTherapeuticClassFn } = useMutation({
    mutationFn: (data: RegisterTherapeuticClassBody) =>
      registerTherapeuticClass(data, token ?? ""),
    onSuccess(_, __) {
      queryClient.invalidateQueries({ queryKey: ["therapeutic-classes"] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const form = useForm<NewTherapeuticClassSchema>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: NewTherapeuticClassSchema) {
    try {
      await registerTherapeuticClassFn({
        name: data.name,
        description: data.description,
      });

      toast({
        title: "Classe Terapêutica",
        description: "Classe Terapêutica cadastrada com sucesso!",
      });
    } catch (error) {
      const errorMessage = handleApiError(error);

      toast({
        title: "Error ao cadastrar a classe terapêutica",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova Classe Terapêutica</DialogTitle>
        <DialogDescription>
          Cadastre sua nova classe terapêutica.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Classe Terapêutica..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva a classe terapêutica aqui..."
                    className="resize-none"
                    {...field}
                  />
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
                Cadastrar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
