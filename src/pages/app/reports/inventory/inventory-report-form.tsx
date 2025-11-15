import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import { fetchTherapeuticClasses } from "@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class";
import { getInventoryReport } from "@/api/pharma/reports/inventory-report";
import { Combobox } from "@/components/comboboxes/combobox";
import { ComboboxMany } from "@/components/comboboxes/combobox-many";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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

import { useInventoryReportPdf } from "./use-inventory-report";

export const inventoryReportFormSchema = z.object({
  stockId: z.string().optional(),
  medicineName: z.string().optional(),
  therapeuticClassesIds: z.array(z.string()).default([]),
  isLowStock: z.coerce.boolean().optional(),
  group: z.coerce.boolean().optional(),
  includeBatches: z.coerce.boolean().optional(),
});
type InventoryReportFormSchema = z.infer<typeof inventoryReportFormSchema>;

export function InventoryReportForm() {
  const [queryStock, setQueryStock] = useState("");
  const [queryTherapeuticClass, setqueryTherapeuticClass] = useState("");

  const [filters, setFilters] = useState<InventoryReportFormSchema | null>(
    null,
  );

  const { token, institutionId } = useAuth();
  const generatePdf = useInventoryReportPdf();
  const generateGroupedPdf = useInventoryReportPdf.grouped();

  const form = useForm<InventoryReportFormSchema>({
    resolver: zodResolver(inventoryReportFormSchema),
    defaultValues: {
      isLowStock: undefined,
      medicineName: "",
      stockId: "",
      therapeuticClassesIds: [],
      group: undefined,
      includeBatches: undefined,
    },
  });

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks", queryStock],
    queryFn: () => fetchStocks({ page: 1, query: queryStock }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const {
    data: therapeuticClassesResult,
    isFetching: isFetchingTherapeuticClasses,
  } = useQuery({
    queryKey: ["therapeuticClasses", queryTherapeuticClass],
    queryFn: () =>
      fetchTherapeuticClasses(
        { page: 1, query: queryTherapeuticClass },
        token ?? "",
      ),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { refetch, isFetching } = useQuery({
    queryKey: [
      "inventory-report",
      institutionId,
      filters?.stockId ?? null,
      filters?.medicineName ?? null,
      (filters?.therapeuticClassesIds ?? []).join(",") || null,
      filters?.isLowStock ?? null,
      filters?.group ?? null,
      filters?.includeBatches ?? null,
    ],
    queryFn: ({ queryKey }) => {
      const [
        ,
        institutionIdRaw,
        stockId,
        medicineName,
        therapeuticClasses,
        isLow,
        group,
        includeBatches,
      ] = queryKey;
      const institutionId =
        typeof institutionIdRaw === "string" ? institutionIdRaw : "";
      return getInventoryReport(
        {
          institutionId,
          stockId: stockId as string | undefined,
          medicineName: medicineName as string | undefined,
          therapeuticClassesIds: (therapeuticClasses as string | null)
            ?.split(",")
            .filter(Boolean),
          isLowStock:
            typeof isLow === "boolean" ? (isLow as boolean) : undefined,
          group: typeof group === "boolean" ? (group as boolean) : undefined,
          includeBatches:
            typeof includeBatches === "boolean"
              ? (includeBatches as boolean)
              : undefined,
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
    // se incluir lotes, forçar agrupado
    if (values.includeBatches) {
      form.setValue("group", true);
      values.group = true;
    }
    setFilters(values);

    setTimeout(async () => {
      const result = await refetch();
      const payload = result.data as any;
      if (payload?.inventory) {
        generatePdf(payload.inventory, {
          stock: values.stockId
            ? stocksResult?.stocks.find((s) => s.id === values.stockId)?.name
            : undefined,
          medicineName: values.medicineName,
          therapeuticClasses:
            values.therapeuticClassesIds?.map((id) => {
              const tc = therapeuticClassesResult?.therapeutic_classes.find(
                (t) => t.id === id,
              );
              return tc?.name ?? id;
            }) ?? [],
          isLowStock: values.isLowStock,
        });
      } else if (payload?.stocks) {
        generateGroupedPdf(payload.stocks, {
          includeBatches: !!values.includeBatches,
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
            name="medicineName"
            render={({ field }) => (
              <FormItem className="col-span-4 grid">
                <FormLabel>Nome do Medicamento</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Medicamento..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockId"
            render={({ field }) => (
              <FormItem className="col-span-4 grid">
                <FormLabel>Estoque</FormLabel>
                <Combobox
                  items={stocksResult?.stocks || []}
                  field={{ value: field.value ?? "" }}
                  query={queryStock}
                  placeholder="Selecione um estoque"
                  isFetching={isFetchingStocks}
                  onQueryChange={setQueryStock}
                  onSelect={(id, name) => {
                    form.setValue("stockId", id);
                    setQueryStock(name);
                  }}
                  itemKey="id"
                  itemValue="name"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Therapeutic classes moved to bottom to avoid chips affecting layout */}

          <FormField
            control={form.control}
            name="isLowStock"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Estoque baixo?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Agrupar por estoque/medicamento</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="includeBatches"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(v) => {
                      field.onChange(v);
                      if (v) {
                        form.setValue("group", true);
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Incluir lotes (ativa agrupado)</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="therapeuticClassesIds"
            render={({ field }) => (
              <FormItem className="col-span-12 grid">
                <FormLabel>Classes Terapêuticas</FormLabel>
                <ComboboxMany
                  field={{
                    value: (field.value ?? []).map((id) => {
                      const therapeuticClass =
                        therapeuticClassesResult?.therapeutic_classes.find(
                          (inst) => inst.id === id,
                        );
                      return {
                        id,
                        value: therapeuticClass
                          ? therapeuticClass.name
                          : "Carregando...",
                      };
                    }),
                  }}
                  items={therapeuticClassesResult?.therapeutic_classes ?? []}
                  itemKey="id"
                  onChange={(selectedItems) =>
                    field.onChange(selectedItems.map((item) => item.id))
                  }
                  onQueryChange={setqueryTherapeuticClass}
                  query={queryTherapeuticClass}
                  isFetching={isFetchingTherapeuticClasses}
                  formatItem={(item) => `${item.name}`}
                  placeholder="Classes Terapêuticas"
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
