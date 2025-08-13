import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchPharmaceuticalForms } from "@/api/pharma/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form";
import { fetchUnitsMeasure } from "@/api/pharma/auxiliary-records/unit-measure/fetch-units-measure";
import { fetchMedicines } from "@/api/pharma/medicines/fetch-medicines";
import { getMedicineVariant } from "@/api/pharma/medicines-variants/get-medicine-variant";
import {
  updateMedicineVariant,
  type UpdateMedicineVariantBody,
} from "@/api/pharma/medicines-variants/update-medicine-variant";
import { Combobox } from "@/components/comboboxes/combobox";
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
import { ComboboxUp } from "@/components/comboboxes/combobox-up";

const updateMedicineVariantSchema = z.object({
  medicineId: z.string({
    required_error: "Selecione um medicamento.",
  }),
  pharmaceuticalFormId: z.string({
    required_error: "Selecione uma forma farmaceutica.",
  }),
  dosage: z.string({
    required_error: "Digite uma dosagem.",
  }),
  unitMeasureId: z.string({
    required_error: "Selecione uma unidade de medida",
  }),
  complement: z.string().optional(),
});
type UpdateMedicineVariantSchema = z.infer<typeof updateMedicineVariantSchema>;

interface UpdateMedicineVariantProps {
  medicineVariantId: string;
  open: boolean;
  onSuccess?: () => void;
}

export function UpdateMedicineVariantDialog({
  medicineVariantId,
  open,
  onSuccess,
}: UpdateMedicineVariantProps) {
  const { token } = useAuth();
  const [queryMedicine, setQueryMedicine] = useState("");
  const [queryPharmaceuticalForm, setQueryPharmaceuticalForm] = useState("");
  const [queryUnitMeasure, setQueryUnitMeasure] = useState("");

  const { data: medicineVariant, isLoading } = useQuery({
    queryKey: ["medicine-variant", medicineVariantId],
    queryFn: () => getMedicineVariant({ id: medicineVariantId }, token ?? ""),
    enabled: open,
  });

  const form = useForm<UpdateMedicineVariantSchema>({
    resolver: zodResolver(updateMedicineVariantSchema),
    values: {
      medicineId: medicineVariant?.medicineId ?? "",
      dosage: medicineVariant?.dosage ?? "",
      pharmaceuticalFormId: medicineVariant?.pharmaceuticalFormId ?? "",
      unitMeasureId: medicineVariant?.unitMeasureId ?? "",
      complement: medicineVariant?.complement ?? "",
    },
  });

  const { data: medicinesResult, isFetching: isFetchingMedicines } = useQuery({
    queryKey: ["medicines", queryMedicine],
    queryFn: () =>
      fetchMedicines({ page: 1, query: queryMedicine }, token ?? ""),
    enabled: queryMedicine !== null,
    staleTime: 1000,
    refetchOnMount: true,
  });

  const {
    data: pharmaceuticalFormResult,
    isFetching: isFetchingPharmaceuticalForm,
  } = useQuery({
    queryKey: ["pharmaceutical-forms", queryPharmaceuticalForm],
    queryFn: () =>
      fetchPharmaceuticalForms(
        { page: 1, query: queryPharmaceuticalForm },
        token ?? "",
      ),
    enabled: queryPharmaceuticalForm !== null,
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { data: unitsMeasureResult, isFetching: isFetchingUnitsMeasure } =
    useQuery({
      queryKey: ["units-measure", queryUnitMeasure],
      queryFn: () =>
        fetchUnitsMeasure({ page: 1, query: queryUnitMeasure }, token ?? ""),
      enabled: queryUnitMeasure !== null,
      staleTime: 1000,
      refetchOnMount: true,
    });

  const { mutateAsync: updateMedicineVariantFn } = useMutation({
    mutationFn: (data: UpdateMedicineVariantBody) =>
      updateMedicineVariant(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["medicines-variants"],
      });
      if (onSuccess) onSuccess();
    },
  });

  async function handleUpdateMedicineVariant(
    data: UpdateMedicineVariantSchema,
  ) {
    try {
      await updateMedicineVariantFn({
        medicineVariantId,
        complement: data.complement,
        dosage: data.dosage,
        pharmaceuticalFormId: data.pharmaceuticalFormId,
        unitMeasureId: data.unitMeasureId,
      });

      toast({
        title: `Variante atualizada com sucesso!`,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao tentar atualizar a variante.",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Variante de Medicamento</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateMedicineVariant)}
          className="grid grid-cols-3 justify-center space-x-1 space-y-2"
        >
          {isLoading ? (
            <>
              <Skeleton className="col-span-3 h-8" />
              <Skeleton className="col-span-3 h-16" />
              <Skeleton className="col-span-3 h-8" />
              <Skeleton className="col-span-1 h-8" />
              <Skeleton className="col-span-1 h-8" />
              <Skeleton className="col-span-1 h-8" />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="medicineId"
                // disabled={true}
                render={({ field }) => (
                  <FormItem className="col-span-3 flex flex-col">
                    <FormLabel>Medicamento</FormLabel>
                    <ComboboxUp
                      formatItem={(item) => item.name}
                      isDisable={true}
                      items={medicinesResult?.medicines || []}
                      field={field}
                      query={queryMedicine}
                      placeholder="Selecione o medicamento "
                      isFetching={isFetchingMedicines}
                      onQueryChange={setQueryMedicine}
                      onSelect={(id, item) => {
                        form.setValue("medicineId", id);
                        setQueryMedicine(item.name);
                      }}
                      itemKey="id"
                      itemValue="name"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pharmaceuticalFormId"
                render={({ field }) => (
                  <FormItem className="col-span-3 flex flex-col">
                    <FormLabel>Forma Farmacêutica</FormLabel>
                    <ComboboxUp
                      formatItem={(item) => item.name}
                      items={
                        pharmaceuticalFormResult?.pharmaceutical_forms || []
                      }
                      field={field}
                      query={queryPharmaceuticalForm}
                      placeholder="Selecione a forma farmacêutica"
                      isFetching={isFetchingPharmaceuticalForm}
                      onQueryChange={setQueryPharmaceuticalForm}
                      onSelect={(id, item) => {
                        form.setValue("pharmaceuticalFormId", id);
                        setQueryPharmaceuticalForm(item.name);
                      }}
                      itemKey="id"
                      itemValue="name"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem className="col-span-1 flex flex-col">
                    <FormLabel>Dosagem</FormLabel>
                    <FormControl>
                      <Input placeholder="Dosagem..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitMeasureId"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-col">
                    <FormLabel>Unid. de Medida</FormLabel>
                    <ComboboxUp
                      formatItem={(item) => item.acronym}
                      items={unitsMeasureResult?.units_measure || []}
                      field={field}
                      query={queryUnitMeasure}
                      placeholder="Selecione a unidade de medida"
                      isFetching={isFetchingUnitsMeasure}
                      onQueryChange={setQueryUnitMeasure}
                      onSelect={(id, item) => {
                        form.setValue("unitMeasureId", id);
                        setQueryUnitMeasure(item.acronym);
                      }}
                      itemKey="id"
                      itemValue="acronym"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Complemento..." {...field} />
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
