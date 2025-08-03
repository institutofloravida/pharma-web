"use client";

import { useState } from "react";
import { Save, FileText, AlertCircle, Users, Calendar } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { PatientSearch } from "./components/patient-search";
import { MedicineDispensationSearch } from "./components/medicine-dispensation-search";
import { DispensationMedicineCard } from "./components/dispensation-medicine-card";
import {
  dispensationFormSchema,
  type DispensationFormSchema,
} from "./schemas/dispensation";
import type {
  Patient,
  MedicineStock,
  Stock,
  DispensationMedicine,
  BatchPreview,
} from "./types/dispensation";
import { DispensationConfirmationModal } from "./components/dispensation-confirmation-modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import { useAuth } from "@/contexts/authContext";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { DatePickerFormItem } from "@/components/date/date-picker-form-item";
import type { User } from "@/api/pharma/users/fetch-users";
import { dispensationPreview } from "@/api/pharma/dispensation/dispensation-preview";
import type { MedicineStockDetails } from "@/api/pharma/stock/medicine-stock/fetch-medicines-stock";
import {
  registerDispensation,
  type RegisterDispensationBody,
} from "@/api/pharma/dispensation/register-dispensation";
import { queryClient } from "@/lib/react-query";

export default function DispensationPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<
    DispensationMedicine[]
  >([]);
  const [queryStock, setQueryStock] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [previewMedicine, setPreviewMedicine] =
    useState<MedicineStockDetails | null>(null);
  const [previewQuantity, setPreviewQuantity] = useState<number | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const form = useForm<DispensationFormSchema>({
    resolver: zodResolver(dispensationFormSchema),
    mode: "onSubmit",
    defaultValues: {
      patientId: "",
      stockId: "",
      medicines: [],
      dispensationDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicines",
  });

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => fetchStocks({ page: 1 }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const {
    mutateAsync: registerDispensationFn,
    isPending: isPendingRegisterDispensation,
  } = useMutation({
    mutationFn: (data: RegisterDispensationBody) =>
      registerDispensation(data, token ?? ""),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["dispensations"],
      });
    },
  });

  const addMedicine = async (
    medicine: MedicineStockDetails,
    quantity: number,
  ) => {
    try {
      setIsLoadingPreview(true);
      setPreviewMedicine(medicine);
      setPreviewQuantity(quantity);

      toast({
        title: "Calculando dispensação...",
        description: "Retornando lotes disponíveis.",
      });

      const batches = await dispensationPreview(
        {
          medicineStockId: medicine.id,
          quantityRequired: quantity,
        },
        token ?? "",
      );

      const newMedicine: DispensationMedicine = {
        id: `medicine-${Date.now()}`,
        medicineStockId: medicine.id,
        medicine,
        quantityRequested: quantity,
        batches: batches.map((batch) => ({
          batchStockId: batch.batchStockId,
          code: batch.code,
          quantity: {
            toDispensation: batch.quantity.toDispensation,
            totalCurrent: batch.quantity.totalCurrent,
          },
          expirationDate: batch.expirationDate,
          manufacturerName: batch.manufacturer,
        })),
      };

      append({
        medicineStockId: medicine.id,
        quantityRequested: quantity,
        batchesStocks: batches.map((batch) => ({
          batchStockId: batch.batchStockId,
          quantity: batch.quantity.toDispensation,
        })),
      });

      setSelectedMedicines([...selectedMedicines, newMedicine]);

      const totalDispensed = batches.reduce(
        (sum, batch) => sum + batch.quantity.toDispensation,
        0,
      );

      toast({
        title: "Medicamento adicionado",
        description: `${medicine.medicine} - ${totalDispensed} unidades serão dispensadas.`,
        duration: 100,
      });
    } catch (error) {
      toast({
        title: "Erro ao calcular dispensação",
        description: "Não foi possível calcular os lotes para dispensação.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const removeMedicine = (index: number) => {
    const medicine = selectedMedicines[index];
    remove(index);
    setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));

    toast({
      title: "Medicamento removido",
      description: `${medicine.medicine.medicine} foi removido da dispensação.`,
      variant: "destructive",
    });
  };

  const handleConfirmClick = () => {
    form.handleSubmit(() => {
      setShowErrors(false);
      setShowConfirmationModal(true);
    }, onError)();
  };

  const handleConfirmDispensation = async () => {
    try {
      const data = form.getValues();

      const apiData: RegisterDispensationBody = {
        patientId: data.patientId,
        stockId: data.stockId,
        dispensationDate: new Date(data.dispensationDate),
        medicines: data.medicines.map((medicine) => {
          return {
            medicineStockId: medicine.medicineStockId,
            batchesStocks: medicine.batchesStocks.map((batch) => {
              return {
                batchStockId: batch.batchStockId,
                quantity: batch.quantity,
              };
            }),
          };
        }),
      };
      await registerDispensationFn(apiData);

      const totalMedicines = data.medicines.length;
      const totalQuantity = data.medicines.reduce(
        (sum, medicine) =>
          sum +
          medicine.batchesStocks.reduce(
            (batchSum, batch) => batchSum + batch.quantity,
            0,
          ),
        0,
      );

      toast({
        title: "✅ Dispensação registrada com sucesso!",
        description: `${totalMedicines} medicamento(s) dispensados totalizando ${totalQuantity} unidades para ${selectedPatient?.name}.`,
      });

      form.reset();
      setSelectedPatient(null);
      setSelectedMedicines([]);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Erro ao registrar dispensação",
        description:
          "Ocorreu um erro ao processar a dispensação de medicamentos.",
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

  const totalMedicines = fields.length;
  const totalBatches = selectedMedicines.reduce(
    (sum, medicine) => sum + medicine.batches.length,
    0,
  );
  const totalQuantity = selectedMedicines.reduce(
    (sum, medicine) =>
      sum +
      medicine.batches.reduce(
        (batchSum, batch) => batchSum + batch.quantity.toDispensation,
        0,
      ),
    0,
  );

  const onSubmit = (data: DispensationFormSchema) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Dispensação de Medicamentos
              </h1>
              <p className="text-sm text-muted-foreground">
                Realize as dispensas com atenção!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 px-2 py-1 text-xs">
                <FileText className="h-3 w-3" />
                {totalMedicines} medicamento(s)
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
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Informações da Dispensação
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem className="col-span-7 grid flex-col">
                      <FormLabel className="text-sm">Usuário</FormLabel>
                      <FormControl>
                        <PatientSearch
                          onSelect={(patient) => {
                            field.onChange(patient.id);
                            setSelectedPatient(patient);
                          }}
                          selectedPatient={selectedPatient ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockId"
                  render={({ field }) => (
                    <FormItem className="col-span-3 grid flex-col">
                      <FormLabel>Estoque</FormLabel>
                      <ComboboxUp
                        isDisable={form.watch("medicines").length > 0}
                        items={stocksResult?.stocks ?? []}
                        field={field}
                        query={queryStock}
                        placeholder="Selecione um estoque"
                        isFetching={isFetchingStocks}
                        onQueryChange={setQueryStock}
                        onSelect={(id, item) => {
                          form.setValue("stockId", id);
                          setSelectedStock(item);
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
                  name={`dispensationDate`}
                  render={({ field }) => (
                    <DatePickerFormItem
                      disabled={(date) => date > new Date()}
                      className="col-span-2 grid"
                      field={field}
                      label="Data de Dispensação"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-base">Adicionar Medicamento</CardTitle>
              <p className="text-xs text-muted-foreground">
                Selecione o medicamento e quantidade.
              </p>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <MedicineDispensationSearch
                onAdd={addMedicine}
                selectedMedicines={selectedMedicines.map((m) => m.medicine)}
                stockId={form.watch("stockId")}
              />
              {isLoadingPreview && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                  Calculando distribuição de quantidades de lotes ...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entries */}
          {fields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Medicamentos para Dispensação
                </h2>
                <Button
                  type="button"
                  onClick={handleConfirmClick}
                  className="h-8 gap-2 px-3 text-sm"
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="h-3 w-3" />
                  {form.formState.isSubmitting
                    ? "Processando..."
                    : "Confirmar Dispensação"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {selectedMedicines.map((medicine, index) => (
                  <DispensationMedicineCard
                    key={medicine.id}
                    control={form.control}
                    medicineIndex={index}
                    medicine={medicine}
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
                  Selecione um paciente e estoque, depois use o campo acima para
                  adicionar medicamentos à dispensação.
                </p>
              </CardContent>
            </Card>
          )}
        </form>
        {/* Modal de Confirmação */}
        <DispensationConfirmationModal
          open={showConfirmationModal}
          onOpenChange={setShowConfirmationModal}
          onConfirm={handleConfirmDispensation}
          isLoading={form.formState.isSubmitting}
          patient={selectedPatient}
          stock={selectedStock}
          dispensationDate={form.watch("dispensationDate")}
          medicines={selectedMedicines}
        />
      </Form>
    </div>
  );
}
