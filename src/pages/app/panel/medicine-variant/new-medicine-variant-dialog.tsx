import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchPharmaceuticalForms } from "@/api/pharma/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form";
import { fetchUnitsMeasure } from "@/api/pharma/auxiliary-records/unit-measure/fetch-units-measure";
import { fetchMedicines } from "@/api/pharma/medicines/fetch-medicines";
import type { FetchMedicinesVariantsResponse } from "@/api/pharma/medicines-variants/fetch-medicines-variants";
import {
  registerMedicineVariant,
  type RegisterMedicineVariantBody,
} from "@/api/pharma/medicines-variants/register-medicine-variant";
import { Combobox } from "@/components/comboboxes/combobox";
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
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";

const FormSchema = z.object({
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

interface NewMedicineVariantDialogProps {
  onSuccess?: () => void;
}

export function NewMedicineVariantDialog({
  onSuccess,
}: NewMedicineVariantDialogProps) {
  const [queryMedicine, setQueryMedicine] = useState("");
  const [queryPharmaceuticalForm, setQueryPharmaceuticalForm] = useState("");
  const [queryUnitMeasure, setQueryUnitMeasure] = useState("");
  const { token } = useAuth();

  const { mutateAsync: registerMedicineVariantFn, isPending } = useMutation({
    mutationFn: (data: RegisterMedicineVariantBody) =>
      registerMedicineVariant(data, token ?? ""),
    onSuccess(_, __) {
      queryClient.invalidateQueries({ queryKey: ["medicines-variants"] });
      if (onSuccess) onSuccess();
      form.reset({
        complement: "",
        dosage: "",
        unitMeasureId: "",
        pharmaceuticalFormId: "",
        medicineId: "",
      });
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await registerMedicineVariantFn({
        medicineId: data.medicineId,
        pharmaceuticalFormId: data.pharmaceuticalFormId,
        unitMeasureId: data.unitMeasureId,
        dosage: data.dosage,
        complement: data.complement,
      });

      toast({
        title: "Variante cadastrada com sucesso!",
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Error ao cadastrar variante!",
        description: errorMessage,
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="items-center">
        <DialogTitle>Nova Variante</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar uma nova variante de medicamento.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 space-x-1 space-y-2"
        >
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
                  items={pharmaceuticalFormResult?.pharmaceutical_forms || []}
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
                  placeholder="Selecione uma unidade..."
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

          <DialogFooter className="col-span-3 mt-2 gap-2">
            <DialogClose asChild>
              <Button variant={"ghost"}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
