import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchMovementTypes } from "@/api/pharma/auxiliary-records/movement-type/fetch-movement-types";
import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import { fetchMedicines } from "@/api/pharma/medicines/fetch-medicines";
import { fetchMedicinesVariants } from "@/api/pharma/medicines-variants/fetch-medicines-variants";
import { ExitType } from "@/api/pharma/movement/exit/register-medicine-exit";
import { fetchOperators } from "@/api/pharma/operators/fetch-operators";
import { getMovimentationInAPeriodReport } from "@/api/pharma/reports/movimentation-in-a-period-report";
import { fetchBatchesOnStock } from "@/api/pharma/stock/bacth-stock/fetch-batches-stock";
import { fetchMedicinesOnStock } from "@/api/pharma/stock/medicine-stock/fetch-medicines-stock";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { SelectDirection } from "@/components/selects/locate/select-direction";
import { SelectExitType } from "@/components/selects/locate/select-exit-type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/authContext";
import { dateFormatter } from "@/lib/utils/formatter";
import { MovementTypeDirection } from "@/lib/utils/movement-type";
import { getOperatorRoleTranslation } from "@/lib/utils/translations-mappers/operator-role-translation";

import { useMovimentationReportPdf } from "./use-movimentation-report";
import { DatePickerFormItem } from "@/components/date/date-picker-form-item";

export const movimentationReportFormSchema = z.object({
  direction: z.nativeEnum(MovementTypeDirection).optional(),
  medicineId: z.string().optional(),
  medicineName: z.string().optional(),
  medicineVariantId: z.string().optional(),
  medicineVariantName: z.string().optional(),
  stockId: z.string().optional(),
  stockName: z.string().optional(),
  medicineStockId: z.string().optional(),
  medicineStockName: z.string().optional(),
  batchStockId: z.string().optional(),
  batchStockName: z.string().optional(),
  movementTypeId: z.string().optional(),
  movementTypeName: z.string().optional(),
  exitType: z.nativeEnum(ExitType).optional(),
  quantity: z.number().optional(),
  operatorId: z.string().optional(),
  operatorName: z.string().optional(),
  startDate: z.date({
    required_error: "A data início é obrigatória.",
  }),
  endDate: z.date({
    required_error: "A data fim é obrigatória.",
  }),
});
type MovimentationReportFormSchema = z.infer<
  typeof movimentationReportFormSchema
>;

export function MovimentationReportForm() {
  const [queryUsers, setQueryUsers] = useState("");
  const [queryMedicine, setQueryMedicine] = useState("");
  const [queryMedicineVariant, setQueryMedicineVariant] = useState("");
  const [queryStock, setQueryStock] = useState("");
  const [queryMedicineStock, setQueryMedicineStock] = useState("");
  const [queryBatchesStock, setQueryBatchesStock] = useState("");
  const [queryMovementType, setQueryMovementType] = useState("");

  const [filters, setFilters] = useState<MovimentationReportFormSchema | null>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const { token, institutionId } = useAuth();
  const generatePdf = useMovimentationReportPdf();

  const form = useForm<MovimentationReportFormSchema>({
    defaultValues: {
      direction: undefined,
    },
    resolver: zodResolver(movimentationReportFormSchema),
  });

  const { data: operatorsResult, isFetching: isFetchingOperators } = useQuery({
    queryKey: ["operators"],
    queryFn: () => fetchOperators({ page: 1 }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { data: medicinesResult, isFetching: isFetchingMedicines } = useQuery({
    queryKey: ["medicines", queryMedicine],
    queryFn: () =>
      fetchMedicines({ page: 1, query: queryMedicine }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const selectedMedicineId = form.watch("medicineId");
  const {
    data: medicinesVariantsResult,
    isFetching: isFetchingMedicinesVariants,
  } = useQuery({
    queryKey: ["medicines-variants", queryMedicineVariant, selectedMedicineId],
    queryFn: () =>
      fetchMedicinesVariants(
        {
          page: 1,
          query: queryMedicineVariant,
          medicineId: selectedMedicineId ?? "",
        },
        token ?? "",
      ),
    enabled: !!selectedMedicineId && queryMedicineVariant !== null,
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks", queryStock],
    queryFn: () => fetchStocks({ page: 1, query: queryStock }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { data: medicinesStockResult, isFetching: isFetchingMedicinesStock } =
    useQuery({
      queryKey: ["medicines-stock", form.watch("stockId"), queryMedicineStock],
      queryFn: () =>
        fetchMedicinesOnStock(
          {
            page: 1,
            stockId: form.watch("stockId") ?? "",
            medicineName: queryMedicineStock,
          },
          token ?? "",
        ),
      staleTime: 1000,
      enabled: !!form.watch("stockId"),
      refetchOnMount: true,
    });

  const { data: batchesStockResult, isFetching: isFetchingBatchesStock } =
    useQuery({
      queryKey: [
        "batches-stock",
        form.watch("medicineStockId"),
        queryBatchesStock,
      ],
      queryFn: () =>
        fetchBatchesOnStock(
          {
            page: 1,
            medicineStockId: form.watch("medicineStockId") ?? "",
            code: queryBatchesStock,
            includeExpired: true,
            includeZero: true,
          },
          token ?? "",
        ),
      staleTime: 1000,
      enabled: !!form.watch("medicineStockId"),
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

  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      "movimentation-report",
      institutionId,
      filters?.operatorId ?? null,
      filters?.operatorName ?? null,
      filters?.startDate ?? null,
      filters?.endDate ?? null,
      filters?.medicineId ?? null,
      filters?.medicineName ?? null,
      filters?.medicineVariantId ?? null,
      filters?.medicineVariantName ?? null,
      filters?.stockId ?? null,
      filters?.stockName ?? null,
      filters?.medicineStockId ?? null,
      filters?.medicineStockName ?? null,
      filters?.batchStockId ?? null,
      filters?.batchStockName ?? null,
      filters?.exitType ?? null,
      filters?.movementTypeId ?? null,
      filters?.movementTypeName ?? null,
      filters?.direction ?? null,
    ],
    queryFn: ({ queryKey }) => {
      const [
        ,
        institutionIdRaw,
        operatorId,
        _,
        startDate,
        endDate,
        medicineId,
        __,
        medicineVariantId,
        ___,
        stockId,
        ____,
        medicineStockId,
        _____,
        batchStockId,
        ______,
        exitType,
        movementTypeId,
        _______,
        direction,
      ] = queryKey;
      const institutionId =
        typeof institutionIdRaw === "string" ? institutionIdRaw : "";
      return getMovimentationInAPeriodReport(
        {
          institutionId,
          operatorId: operatorId as string | undefined,
          startDate: (startDate as Date) ?? new Date(),
          endDate: (endDate as Date) ?? new Date(),
          medicineId: medicineId as string | undefined,
          medicineVariantId: medicineVariantId as string | undefined,
          stockId: stockId as string | undefined,
          medicineStockId: medicineStockId as string | undefined,
          batchStockId: batchStockId as string | undefined,
          exitType: exitType as ExitType | undefined,
          movementTypeId: movementTypeId as string | undefined,
          direction: direction as MovementTypeDirection | undefined,
        },
        token ?? "",
      );
    },
    enabled: false,
  });
  const handleClick = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();

    setFilters(values);

    setTimeout(async () => {
      const result = await refetch();

      if (result.data?.movimentation) {
        generatePdf(result.data.movimentation, {
          medicine: values.medicineName,
          startDate: values.startDate ?? new Date(),
          endDate: values.endDate ?? new Date(),
          operator: values.operatorName,
          institutionId: institutionId ?? "",
          medicineVariant: values.medicineVariantName,
          stock: values.stockName,
          medicineStock: values.medicineStockName,
          batcheStock: values.batchStockName,
          exitType: values.exitType,
          direction: values.direction,
        });
      }
    }, 0);
  };

  const handleClearFilters = () => {
    form.reset();
    setFilters(null);
  };

  return (
    <Form {...form}>
      <form className="w-full items-center gap-2">
        <div className="grid grid-cols-12 gap-2">
          <FormField
            control={form.control}
            name={`startDate`}
            render={({ field }) => (
              <DatePickerFormItem
                disabled={(date) => date > new Date()}
                className="col-span-2 grid"
                field={field}
                label="Data de Início"
                placeholder="Início"
              />
            )}
          />

          <FormField
            control={form.control}
            name={`endDate`}
            render={({ field }) => (
              <DatePickerFormItem
                disabled={(date) => date > new Date()}
                className="col-span-2 grid"
                field={field}
                label="Data de Fim"
                placeholder="Fim"
              />
            )}
          />

          <FormField
            control={form.control}
            name="operatorId"
            render={({ field }) => (
              <FormItem className="col-span-8 grid gap-1">
                <FormLabel>Operador</FormLabel>
                <ComboboxUp
                  field={{
                    value: field.value ?? "",
                    onChange: field.onChange,
                  }}
                  items={operatorsResult?.operators ?? []}
                  itemKey="id"
                  onQueryChange={setQueryUsers}
                  query={queryUsers}
                  isFetching={isFetchingOperators}
                  formatItem={(item) =>
                    `${item.name ?? ""} - ${getOperatorRoleTranslation(item.role) ?? ""} - ${item.email ?? ""}`
                  }
                  getItemText={(item) =>
                    `${item.name ?? ""} - ${getOperatorRoleTranslation(item.role) ?? ""} - ${item.email ?? ""}`
                  }
                  placeholder="Pesquise por um Operador"
                  onSelect={(id, item) => {
                    form.setValue("operatorId", id);
                    form.setValue("operatorName", item.name);
                  }}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormItem className="col-span-2 grid">
                <FormLabel>Direção</FormLabel>
                <FormControl>
                  <SelectDirection
                    key={field.value}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicineId"
            render={({ field }) => (
              <FormItem className="col-span-4 grid">
                <FormLabel>Medicamento</FormLabel>
                <ComboboxUp
                  items={medicinesResult?.medicines || []}
                  field={{
                    value: field.value ?? "",
                    onChange: field.onChange,
                  }}
                  formatItem={(item) => item.name}
                  getItemText={(item) => item.name}
                  query={queryMedicine}
                  placeholder="Medicamento específico "
                  isFetching={isFetchingMedicines}
                  onQueryChange={setQueryMedicine}
                  onSelect={(id, item) => {
                    form.setValue("medicineId", id);
                    form.setValue("medicineName", item.name);
                    form.setValue("medicineVariantId", undefined);
                    form.setValue("medicineVariantName", undefined);
                  }}
                  itemKey="id"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={!selectedMedicineId}
            control={form.control}
            name="medicineVariantId"
            render={({ field }) => (
              <FormItem className="col-span-6 grid">
                <FormLabel>Variante</FormLabel>
                <ComboboxUp
                  isDisable={!selectedMedicineId}
                  items={medicinesVariantsResult?.medicines_variants ?? []}
                  field={{
                    value: field.value ?? "",
                    onChange: field.onChange,
                  }}
                  query={queryMedicineVariant}
                  placeholder="Selecione a variante"
                  isFetching={isFetchingMedicinesVariants}
                  onQueryChange={setQueryMedicineVariant}
                  getItemText={(item) =>
                    `${item.medicine} - ${item.dosage}${item.unitMeasure} - ${item.pharmaceuticalForm}`
                  }
                  onSelect={(id, item) => {
                    form.setValue("medicineVariantId", id);
                    form.setValue(
                      "medicineVariantName",
                      `${item.dosage}${item.unitMeasure} ${item.pharmaceuticalForm}`,
                    );
                  }}
                  itemKey="id"
                  formatItem={(item) => {
                    return `${item.medicine} - ${item.dosage}${item.unitMeasure} - ${item.pharmaceuticalForm}`;
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockId"
            render={({ field }) => (
              <FormItem className="col-span-3 grid">
                <FormLabel>Estoque</FormLabel>
                <ComboboxUp
                  items={stocksResult?.stocks ?? []}
                  field={{
                    value: field.value ?? "",
                    onChange: field.onChange,
                  }}
                  query={queryStock}
                  placeholder="Selecione um estoque"
                  isFetching={isFetchingStocks}
                  onQueryChange={setQueryStock}
                  onSelect={(id, item) => {
                    form.setValue("stockId", id);
                    form.setValue("stockName", item.name);
                  }}
                  itemKey="id"
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

          <FormField
            control={form.control}
            name="medicineStockId"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-col">
                <FormLabel>Medicamento em estoque</FormLabel>
                <ComboboxUp
                  items={medicinesStockResult?.medicines_stock ?? []}
                  field={{
                    value: field.value ?? "",
                    onChange: field.onChange,
                  }}
                  query={queryMedicineStock}
                  placeholder="Selecione um medicamento"
                  isFetching={isFetchingMedicinesStock}
                  onQueryChange={setQueryMedicineStock}
                  onSelect={(id, item) => {
                    form.setValue("medicineStockId", id);
                    form.setValue("quantity", 0);
                    form.setValue(
                      "medicineStockName",
                      `${item.medicine} - ${item.dosage}${item.unitMeasure} - ${item.pharmaceuticalForm}`,
                    );
                  }}
                  itemKey="id"
                  getItemText={(item) =>
                    `${item.medicine} ${item.pharmaceuticalForm} ${item.unitMeasure}`
                  }
                  formatItem={(item) => (
                    <div className="flex gap-2">
                      <span>
                        {item.medicine} - {item.pharmaceuticalForm} -{" "}
                        {item.dosage}
                        {item.unitMeasure}
                      </span>
                      {/* <div className="text-sm">
                      <span className="text-green-600">
                        {item.quantity.available} disp.
                      </span>
                      {item.quantity.unavailable > 0 && (
                        <span className="ml-2 text-red-500">
                          {item.quantity.unavailable} indis.
                        </span>
                      )}
                    </div> */}
                    </div>
                  )}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="batchStockId"
            render={({ field }) => (
              <FormItem className="col-span-3 grid">
                <FormLabel>Lote</FormLabel>
                <ComboboxUp
                  items={batchesStockResult?.batches_stock ?? []}
                  field={{
                    value: field.value ?? "",
                    onChange: field.onChange,
                  }}
                  query={queryBatchesStock}
                  placeholder="Selecione um lote"
                  isFetching={isFetchingBatchesStock}
                  onQueryChange={setQueryBatchesStock}
                  onSelect={(id, item) => {
                    form.setValue("batchStockId", id);
                    form.setValue("batchStockName", item.batch);
                    form.setValue("quantity", 0);
                  }}
                  itemKey="id"
                  getItemText={(item) =>
                    `${item.batch} | ${dateFormatter.format(new Date(item.expirationDate))} | ${item.quantity}`
                  }
                  formatItem={(item) => (
                    <div className="flex gap-2">
                      <span>
                        {item.batch} -{" "}
                        {/* {dateFormatter.format(item.expirationDate)} -{' '} */}
                      </span>
                      <div className="text-sm">
                        <span
                          className={`${item.isAvailable ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                  )}
                />
                {/* {selectedMedicine &&
                          selectedMedicine.quantity.available <= 0 && (
                            <FormDescription>
                              Não existem quantidades válidas para este medicamento
                            </FormDescription>
                          )} */}
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("direction") === MovementTypeDirection.EXIT && (
            <FormField
              control={form.control}
              name="exitType"
              render={({ field }) => (
                <FormItem className="col-span-2 grid">
                  <FormLabel>Tipo de Saída</FormLabel>
                  <SelectExitType
                    onChange={field.onChange}
                    includeDispensation
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("exitType") === ExitType.MOVEMENT_TYPE && (
            <FormField
              control={form.control}
              name="movementTypeId"
              render={({ field }) => (
                <FormItem className="col-span-4 grid">
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <ComboboxUp
                    items={movementTypesResult?.movement_types ?? []}
                    field={{
                      value: field.value ?? "",
                      onChange: field.onChange,
                    }}
                    query={queryMovementType}
                    placeholder="Selecione..."
                    isFetching={isFetchingMovementTypes}
                    onQueryChange={setQueryMovementType}
                    onSelect={(id, item) => {
                      form.setValue("movementTypeId", id);
                      form.setValue("movementTypeName", item.name);
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
          <div className="col-end-[-1] flex items-end justify-end gap-2">
            <Button
              onClick={handleClearFilters}
              type="button"
              variant={"outline"}
              size={"xs"}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar Campos
            </Button>
            <Button onClick={handleClick} disabled={isFetching} type="button">
              {isFetching ? "Gerando relatório..." : "Gerar PDF"}{" "}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
