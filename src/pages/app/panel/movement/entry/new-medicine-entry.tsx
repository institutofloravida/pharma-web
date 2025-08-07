"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FileText, Save } from "lucide-react";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { fetchMovementTypes } from "@/api/pharma/auxiliary-records/movement-type/fetch-movement-types";
import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import type { MedicineVariant } from "@/api/pharma/medicines-variants/fetch-medicines-variants";
import {
  EntryType,
  registerMedicineEntry,
} from "@/api/pharma/movement/entry/register-medicine-entry";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { DatePickerFormItem } from "@/components/date/date-picker-form-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/hooks/use-toast";
import { MovementTypeDirection } from "@/lib/utils/movement-type";

import { MedicationEntryCard } from "./components/medicine-entry-card";
import { MedicationSearch } from "./components/medicine-search";

const newMedicineEntrySchema = z.object({
  movementTypeId: z.string({
    required_error: "Selecione o tipo de movimentação.",
  }),
  medicines: z
    .array(
      z.object({
        medicineVariantId: z.string().min(1, "Selecione o medicamento."),
        variant: z.custom<MedicineVariant>(),
        batches: z.array(
          z.object({
            code: z.string().min(1, "Digite o código do lote."),
            expirationDate: z.coerce.date({
              required_error: "Selecione a data de validade.",
              invalid_type_error: "Data de validade inválida.",
              message: "Data de validade inválida.",
            }),
            manufacturerId: z.string().min(1, "Selecione o fabricante."),
            manufacturingDate: z.coerce.date().optional(),
            quantityToEntry: z.coerce
              .number()
              .min(1, "Informe uma quantidade válida."),
          }),
        ),
      }),
    )
    .min(1, { message: "É necessário informar pelo menos um medicamento." }),
  entryDate: z.coerce.date({ required_error: "Selecione a data de entrada." }),
  stockId: z.string({
    required_error: "Selecione o estoque.",
  }),
  nfNumber: z.string().min(1, "Digite o número da nota fiscal."),
});

type NewMedicineEntrySchema = z.infer<typeof newMedicineEntrySchema>;

export default function NewMedicineEntryPage() {
  const [queryStock, setQueryStock] = useState("");
  const [queryMovementType, setQueryMovementType] = useState("");
  const navigate = useNavigate();

  const { toast } = useToast();
  const { token, institutionId } = useAuth();

  const form = useForm<NewMedicineEntrySchema>({
    resolver: zodResolver(newMedicineEntrySchema),
    defaultValues: {
      movementTypeId: undefined,
      medicines: [],
      entryDate: new Date(),
      stockId: undefined,
      nfNumber: undefined,
    },
  });

  const {
    fields: medicinesFields,
    append: appendMedicine,
    remove: removeMedicine,
    insert: insertMedicine,
  } = useFieldArray({
    control: form.control,
    name: "medicines",
  });

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks", queryStock],
    queryFn: () =>
      fetchStocks(
        { page: 1, query: queryStock, institutionsIds: [institutionId ?? ""] },
        token ?? "",
      ),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { data: movementTypesResult, isFetching: isFetchingMovementTypes } =
    useQuery({
      queryKey: [
        "movement-types",
        queryMovementType,
        MovementTypeDirection.ENTRY,
      ],
      queryFn: () =>
        fetchMovementTypes(
          {
            page: 1,
            query: queryMovementType,
            direction: MovementTypeDirection.ENTRY,
          },
          token ?? "",
        ),
      staleTime: 1000,
      refetchOnMount: true,
    });

  const addMedication = (medication: MedicineVariant) => {
    insertMedicine(0, {
      medicineVariantId: medication.id,
      variant: medication,
      batches: [
        {
          code: "",
          expirationDate: undefined,
          manufacturerId: "",
          manufacturingDate: undefined,
          quantityToEntry: 0,
        },
      ],
    });
  };

  const handleSave = async (data: NewMedicineEntrySchema) => {
    console.log("Saving data:", data);
    const apiPayload = {
      movementTypeId: data.movementTypeId,
      medicines: data.medicines,
      entryDate: data.entryDate,
      stockId: data.stockId,
      nfNumber: data.nfNumber,
    };

    try {
      await registerMedicineEntry(
        {
          nfNumber: apiPayload.nfNumber,
          stockId: apiPayload.stockId,
          entryType: EntryType.MOVEMENT_TYPE,
          entryDate: apiPayload.entryDate,
          movementTypeId: apiPayload.movementTypeId,
          medicines: apiPayload.medicines.map((med) => ({
            medicineVariantId: med.medicineVariantId,
            batches: med.batches.map((batch) => ({
              code: batch.code,
              expirationDate: batch.expirationDate,
              manufacturerId: batch.manufacturerId,
              manufacturingDate: batch.manufacturingDate,
              quantityToEntry: batch.quantityToEntry,
            })),
          })),
        },
        token ?? "",
      );

      toast({
        title: "✅ Entrada salva com sucesso!",
        description: `${data.medicines.length} medicamento(s) e ${data.medicines.reduce(
          (sum, m) => sum + m.batches.length,
          0,
        )} lote(s) foram registrados.`,
      });
      form.reset({});
    } catch (error) {
      toast({
        title: "Erro ao registrar entrada",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const totalMedications = medicinesFields.length;
  const totalBatches = medicinesFields.reduce(
    (sum, entry) => sum + entry.batches.length,
    0,
  );
  const totalQuantity = medicinesFields.reduce(
    (sum, entry) =>
      sum +
      entry.batches.reduce(
        (batchSum, batch) => batchSum + (batch.quantityToEntry || 0),
        0,
      ),
    0,
  );

  const selectedMedicineIds = medicinesFields.map(
    (entry) => entry.medicineVariantId,
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="container mx-auto max-w-7xl p-4">
          <div className="space-y-6">
            {/* Botão de voltar */}
            <div className="mb-2 flex items-center">
              <Button
                type="button"
                variant="outline"
                className="mr-4"
                onClick={() => navigate("/movement/entries")}
              >
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Entrada de Medicamentos
                </h1>
                <p className="text-muted-foreground">
                  Gerencie a entrada de medicamentos e seus respectivos lotes
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-12 gap-2">
                <FormField
                  control={form.control}
                  name="stockId"
                  render={({ field }) => {
                    return (
                      <FormItem className="col-span-3 flex flex-col">
                        <FormLabel>Estoque</FormLabel>
                        <ComboboxUp
                          items={stocksResult?.stocks ?? []}
                          field={field}
                          query={queryStock}
                          placeholder="Selecione um estoque"
                          isFetching={isFetchingStocks}
                          onQueryChange={setQueryStock}
                          onSelect={(id, _) => {
                            form.setValue("stockId", id);
                          }}
                          itemKey="id"
                          formatItem={(item) => {
                            return `${item.name} - ${item.status ? "ATIVO" : "INATIVO"}`;
                          }}
                          getItemText={(item) => {
                            return `${item.name} - ${item.status ? "ATIVO" : "INATIVO"}`;
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="movementTypeId"
                  render={({ field }) => (
                    <FormItem className="col-span-3 grid">
                      <FormLabel>Tipo de Movimentação</FormLabel>
                      <ComboboxUp
                        items={movementTypesResult?.movement_types ?? []}
                        field={field}
                        query={queryMovementType}
                        placeholder="Selecione um tipo"
                        isFetching={isFetchingMovementTypes}
                        onQueryChange={setQueryMovementType}
                        onSelect={(id, _) => {
                          form.setValue("movementTypeId", id);
                        }}
                        itemKey="id"
                        getItemText={(item) => {
                          return `${item.name}`;
                        }}
                        formatItem={(item) => {
                          return `${item.name}`;
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entryDate`}
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <DatePickerFormItem
                      disabled={(date) => date > new Date()}
                      className="col-span-2 grid"
                      field={field}
                      label="Data de Entrada"
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="nfNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-4 flex flex-col gap-1">
                      <FormLabel>Número da Nota Fiscal</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="número da nota fiscal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Medicamento</CardTitle>
              </CardHeader>
              <CardContent>
                <MedicationSearch
                  onSelect={addMedication}
                  selectedMedications={selectedMedicineIds}
                />
              </CardContent>
            </Card>

            {/* Entries */}
            {medicinesFields.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Medicamentos Selecionados
                  </h2>
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Entrada
                  </Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  {medicinesFields.map((medicine, medicineIndex) => (
                    <MedicationEntryCard
                      key={medicine.id}
                      medicineIndex={medicineIndex}
                      medicineField={medicine}
                      onRemove={() => removeMedicine(medicineIndex)}
                      medicineVariant={medicine.variant}
                      batches={form.watch(`medicines.${medicineIndex}.batches`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {medicinesFields.length === 0 && (
              <Card className="py-12 text-center">
                <CardContent>
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Nenhum medicamento selecionado
                  </h3>
                  <p className="text-muted-foreground">
                    Use o campo de pesquisa acima para adicionar medicamentos à
                    entrada.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
