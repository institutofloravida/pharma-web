"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatters } from "date-fns";
import { AlertCircle, FileText, Save } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { fetchInstitutions } from "@/api/pharma/auxiliary-records/institution/fetch-institutions";
import { fetchMovementTypes } from "@/api/pharma/auxiliary-records/movement-type/fetch-movement-types";
import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import {
  ExitType,
  registerMedicineExit,
  type RegisterMedicineExitBodyAndParams,
} from "@/api/pharma/movement/exit/register-medicine-exit";
import { Combobox } from "@/components/comboboxes/combobox";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { DatePickerFormItem } from "@/components/date/date-picker-form-item";
import { SelectExitType } from "@/components/selects/locate/select-exit-type";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { Formatter } from "@/lib/utils/formaters/formaters";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { MovementTypeDirection } from "@/lib/utils/movement-type";

import { MedicineExitCard } from "./components/medicine-exit-card";
import { MedicineStockSearch } from "./components/medicine-stock-search";
import {
  batchExitSchema,
  type MedicineExitFormSchema,
  medicineExitFormSchema,
} from "./schemas/medicine-exit";
import {
  type MedicineStock,
  type MovementType,
  type Stock,
} from "./types/medicine-exit";
import {
  createTransfer,
  type CreateTransferBodyAndParams,
} from "@/api/pharma/movement/transfer/create-transfer";
import { exit } from "process";
import { useNavigate } from "react-router-dom";

// Mock data
const mockStocks: Stock[] = [
  { id: "1", name: "Estoque Principal", status: true },
  { id: "2", name: "Estoque Secundário", status: true },
];

const mockMovementTypes: MovementType[] = [
  { id: "1", name: "Transferência" },
  { id: "2", name: "Descarte" },
  { id: "3", name: "Devolução" },
];

export default function MedicineExitPage() {
  const { token, institutionId } = useAuth();
  const [queryStock, setQueryStock] = useState("");
  const [queryStockDestination, setQueryStockDestination] = useState("");
  const [queryMovementType, setQueryMovementType] = useState("");
  const [queryInstitution, setQueryInstitution] = useState("");

  const [selectedMedicines, setSelectedMedicines] = useState<MedicineStock[]>(
    [],
  );
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const navigate = useNavigate();

  const form = useForm<MedicineExitFormSchema>({
    resolver: zodResolver(medicineExitFormSchema),
    mode: "onSubmit",
    defaultValues: {
      stockId: "",
      exitType: ExitType.MOVEMENT_TYPE,
      movementTypeId: "",
      medicines: [],
      exitDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
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

  const { data: institutionsResult, isFetching: isFetchingInstitutions } =
    useQuery({
      queryKey: ["institution-destination", queryInstitution],
      queryFn: () =>
        fetchInstitutions({ page: 1, query: queryInstitution }, token ?? ""),
      enabled: queryInstitution !== null,
      staleTime: 1000,
      refetchOnMount: true,
    });

  const {
    data: stocksDestinationResult,
    isFetching: isFetchingStocksDestination,
  } = useQuery({
    queryKey: [
      "stocks-destination",
      queryStockDestination,
      form.watch("destinationInstitutionId"),
    ],
    queryFn: () =>
      fetchStocks(
        {
          page: 1,
          query: queryStockDestination,
          institutionsIds: [form.watch("destinationInstitutionId") ?? ""],
        },
        token ?? "",
      ),
    staleTime: 1000,
    enabled: !!form.watch("destinationInstitutionId"),
    refetchOnMount: true,
  });

  const { data: movementTypesResult, isFetching: isFetchingMovementTypes } =
    useQuery({
      queryKey: [
        "movement-types",
        queryMovementType,
        MovementTypeDirection.EXIT,
      ],
      queryFn: () =>
        fetchMovementTypes(
          {
            page: 1,
            query: queryMovementType,
            direction: MovementTypeDirection.EXIT,
          },
          token ?? "",
        ),
      enabled: queryStock !== null,
      staleTime: 1000,
      refetchOnMount: true,
    });

  const { mutateAsync: registerMedicineExitFn } = useMutation({
    mutationFn: (data: RegisterMedicineExitBodyAndParams) =>
      registerMedicineExit(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["medicines-exits"],
      });
    },
  });

  const { mutateAsync: createTransferFn } = useMutation({
    mutationFn: (data: CreateTransferBodyAndParams) =>
      createTransfer(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["medicines-exits"],
      });
    },
  });

  const addMedicine = (medicine: MedicineStock) => {
    append({
      medicineStockId: medicine.id,
      batches: [],
    });

    setSelectedMedicines([...selectedMedicines, medicine]);

    toast({
      title: "Medicamento adicionado",
      description: `${medicine.medicine} foi adicionado à lista.`,
    });
  };

  const removeMedicine = (index: number) => {
    const medicine = selectedMedicines[index];
    remove(index);
    setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));

    toast({
      title: "Medicamento removido",
      description: `${medicine.medicine} foi removido da lista.`,
      variant: "destructive",
    });
  };

  const onSubmit = async (data: MedicineExitFormSchema) => {
    try {
      setShowErrors(false);
      console.log("Dados do formulário:", data);

      const batches = data.medicines.flatMap((medicine) =>
        medicine.batches.map((batch) => ({
          batcheStockId: batch.batchStockId,
          quantity: batch.quantity,
        })),
      );
      console.log("transfer type", data.exitType === ExitType.TRANSFER);
      if (data.exitType === ExitType.TRANSFER.toString()) {
        const apiData = {
          stockId: data.stockId,
          exitType: data.exitType,
          stockDestinationId: data.stockDestinationId,
          movementTypeId: data.movementTypeId,
          exitDate: data.exitDate,
          batches,
        };

        console.log("Dados formatados para API:", apiData);
        await createTransferFn({
          exitType: data.exitType,
          stockId: data.stockId,
          transferDate: new Date(data.exitDate),
          batches,
          stockDestinationId: data.stockDestinationId,
        });

        toast({
          title: "✅ Transferência realizada com sucesso!",
          description: `${data.medicines.length} medicamento(s) foram registrados.`,
        });
      } else {
        const apiData = {
          stockId: data.stockId,
          exitType: data.exitType,
          movementTypeId: data.movementTypeId,
          exitDate: data.exitDate,
          batches,
        };

        console.log("Dados formatados para API:", apiData);
        await registerMedicineExitFn({
          exitType: data.exitType,
          movementTypeId: data.movementTypeId,
          stockId: data.stockId,
          exitDate: new Date(data.exitDate),
          batches,
          destinationInstitutionId: data.destinationInstitutionId,
        });

        toast({
          title: "✅ Saída registrada com sucesso!",
          description: `${data.medicines.length} medicamento(s) foram registrados.`,
        });
      }

      // Reset form
      form.reset();
      setSelectedMedicines([]);
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao registrar saída",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onError = (errors: any) => {
    console.log("Erros de validação:", errors);
    setShowErrors(true);

    toast({
      title: "❌ Erro de validação",
      description: "Por favor, corrija os campos destacados em vermelho.",
      variant: "destructive",
    });
  };

  const totalMedications = fields.length;
  const totalBatches = fields.reduce(
    (sum, field) => sum + (field.batches?.length || 0),
    0,
  );
  const totalQuantity = fields.reduce(
    (sum, field) =>
      sum +
      (field.batches?.reduce(
        (batchSum, batch) => batchSum + (batch.quantity || 0),
        0,
      ) || 0),
    0,
  );

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="mb-2 flex items-center">
              <Button
                type="button"
                variant="outline"
                className="mr-4"
                onClick={() => navigate("/movement/exits")}
              >
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Saída de Medicamentos
                </h1>
                <p className="text-muted-foreground">
                  Gerencie a saída de medicamentos e seus respectivos lotes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 px-2 py-1 text-xs">
                <FileText className="h-3 w-3" />
                {totalMedications} medicamento(s)
              </Badge>
              <Badge variant="outline" className="px-2 py-1 text-xs">
                {totalBatches} lote(s)
              </Badge>
              <Badge variant="outline" className="px-2 py-1 text-xs">
                {totalQuantity} unidade(s)
              </Badge>
            </div>
          </div>

          {/* Alert de erros */}
          {showErrors && Object.keys(form.formState.errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Existem campos obrigatórios não preenchidos. Verifique os campos
                destacados em vermelho abaixo.
              </AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base">Informações da Saída</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="stockId"
                  render={({ field }) => (
                    <FormItem className="col-span-3 flex flex-col">
                      <FormLabel>Estoque</FormLabel>
                      <ComboboxUp
                        isDisable={selectedMedicines.length > 0}
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
                  )}
                />

                <FormField
                  control={form.control}
                  name="exitType"
                  render={({ field }) => (
                    <FormItem className="col-span-3 grid">
                      <FormLabel>Tipo de Saída</FormLabel>
                      <SelectExitType
                        onChange={field.onChange}
                        value={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`exitDate`}
                  render={({ field }) => (
                    <DatePickerFormItem
                      disabled={(date) => date > new Date()}
                      className="col-span-2 grid"
                      field={field}
                      label="Data de Saída"
                    />
                  )}
                />

                {(form.watch("exitType") === ExitType.DONATION ||
                  form.watch("exitType") === ExitType.TRANSFER) && (
                  <FormField
                    control={form.control}
                    name="destinationInstitutionId"
                    render={({ field }) => (
                      <FormItem className="col-span-3 grid">
                        <FormLabel>Instituição de destino</FormLabel>
                        <ComboboxUp
                          items={
                            (form.watch("exitType") === ExitType.DONATION
                              ? institutionsResult?.institutions.filter(
                                  (institution) =>
                                    institution.id !== institutionId,
                                )
                              : institutionsResult?.institutions) || []
                          }
                          field={field}
                          query={queryInstitution}
                          placeholder="Instituição de destino"
                          isFetching={isFetchingInstitutions}
                          onQueryChange={setQueryInstitution}
                          onSelect={(id, item) => {
                            form.setValue("destinationInstitutionId", id);
                            form.setValue("stockDestinationId", "");
                            setQueryInstitution("");
                          }}
                          itemKey="id"
                          itemValue="name"
                          formatItem={(item) => {
                            return `${item.name}`;
                          }}
                          getItemText={(item) => {
                            return `${item.name}`;
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("exitType") === ExitType.TRANSFER && (
                  <>
                    {" "}
                    <FormField
                      control={form.control}
                      name="stockDestinationId"
                      render={({ field }) => (
                        <FormItem className="col-span-3 flex flex-col">
                          <FormLabel>Estoque de Destino</FormLabel>
                          <ComboboxUp
                            items={
                              (form.watch("exitType") === ExitType.TRANSFER
                                ? stocksDestinationResult?.stocks.filter(
                                    (stock) =>
                                      stock.id !== form.watch("stockId"),
                                  )
                                : stocksDestinationResult?.stocks) ?? []
                            }
                            field={field}
                            query={queryStockDestination}
                            placeholder="Selecione um estoque"
                            isFetching={isFetchingStocksDestination}
                            onQueryChange={setQueryStockDestination}
                            onSelect={(id, _) => {
                              form.setValue("stockDestinationId", id);
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
                      )}
                    />{" "}
                  </>
                )}
                {form.watch("exitType") === ExitType.MOVEMENT_TYPE && (
                  <FormField
                    control={form.control}
                    name="movementTypeId"
                    render={({ field }) => (
                      <FormItem className="col-span-3 flex flex-col gap-1">
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base">Adicionar Medicamento</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <MedicineStockSearch
                onSelect={addMedicine}
                selectedMedicines={selectedMedicines}
                stockId={form.watch("stockId")}
              />
            </CardContent>
          </Card>

          {/* Entries */}
          {fields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Medicamentos Selecionados
                </h2>
                <Button
                  type="submit"
                  className="h-8 gap-2 px-3 text-sm"
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="h-3 w-3" />
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar Saída"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <MedicineExitCard
                    key={field.id}
                    control={form.control}
                    medicineIndex={index}
                    medicine={selectedMedicines[index]}
                    onRemove={() => removeMedicine(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {fields.length === 0 && (
            <Card className="py-8 text-center">
              <CardContent>
                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-2 text-base font-medium">
                  Nenhum medicamento selecionado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use o campo de pesquisa acima para adicionar medicamentos à
                  saída.
                </p>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}
