import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import { getMonthlyMedicineUtilization } from "@/api/pharma/reports/monthly-medicine-utilization";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { SelectMonth } from "@/components/selects/select-month";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/authContext";

import { useMonthlyMedicineUtilizationReportPdf } from "./use-monthly-medicine-report-report";

export const monthlymedicineutilizationReportFormSchema = z.object({
  institutionId: z.string(),
  year: z.coerce.number(),
  month: z.coerce.number(),
  stockId: z.string().optional(),
  stockName: z.string().optional(),
});
type MonthlyMedicineUtilizationReportFormSchema = z.infer<
  typeof monthlymedicineutilizationReportFormSchema
>;

export function MonthlyMedicineUtilizationReportForm() {
  const { token, institutionId } = useAuth();
  const [queryStock, setQueryStock] = useState("");
  const [queryYear, setQueryYear] = useState("");
  const [filters, setFilters] =
    useState<MonthlyMedicineUtilizationReportFormSchema | null>({
      institutionId: "",
      year: 0,
      month: 0,
    });

  const generatePdf = useMonthlyMedicineUtilizationReportPdf();

  const form = useForm<MonthlyMedicineUtilizationReportFormSchema>({
    defaultValues: {
      institutionId: institutionId ?? "",
    },
    resolver: zodResolver(monthlymedicineutilizationReportFormSchema),
  });

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks", queryStock],
    queryFn: () => fetchStocks({ page: 1, query: queryStock }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      "monthlymedicineutilization-report",
      institutionId,
      filters?.stockId ?? null,
      filters?.stockName ?? null,
      filters?.year ?? null,
      filters?.month ?? null,
    ],
    queryFn: ({ queryKey }) => {
      const [, institutionIdRaw, stockId, ____, year, month] = queryKey;
      const institutionId =
        typeof institutionIdRaw === "string" ? institutionIdRaw : "";
      return getMonthlyMedicineUtilization(
        {
          institutionId,
          stockId: stockId as string | undefined,
          month: Number(month),
          year: Number(year),
        },
        token ?? "",
      );
    },
    enabled: false,
  });
  const handleClick = async () => {
    console.log(form.formState.errors);
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();

    setFilters(values);

    setTimeout(async () => {
      const result = await refetch();

      if (result.data?.utilization) {
        generatePdf(result.data.utilization, {
          institutionId: institutionId ?? "",
          stock: values.stockName,
          year: String(values.year),
          month: String(values.month),
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
        <div className="grid grid-cols-12 grid-rows-2 gap-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="col-span-3 grid gap-1">
                <FormLabel>Ano</FormLabel>
                <ComboboxUp
                  field={{
                    value: String(field.value) ?? "",
                    onChange: field.onChange,
                  }}
                  items={Array.from(
                    { length: new Date().getFullYear() - 2025 + 1 },
                    (_, i) => ({
                      value: String(2025 + i),
                      id: String(2025 + i),
                    }),
                  )}
                  itemKey="id"
                  getItemText={(item) => item.value}
                  formatItem={(item) => item.value}
                  placeholder="Selecione o ano"
                  onSelect={(id, item) => {
                    form.setValue("year", Number(item.value));
                  }}
                  itemValue="id"
                  query={queryYear}
                  onQueryChange={setQueryYear}
                  isFetching={false}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem className="col-span-2 grid">
                <FormLabel>Mês</FormLabel>
                <SelectMonth
                  onChange={field.onChange}
                  value={String(field.value)}
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
                  placeholder="Selecione"
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
