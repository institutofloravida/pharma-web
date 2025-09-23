import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchOperators } from "@/api/pharma/operators/fetch-operators";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/authContext";
import { getOperatorRoleTranslation } from "@/lib/utils/translations-mappers/operator-role-translation";
import { DatePickerFormItem } from "@/components/date/date-picker-form-item";
import { ExitType } from "@/api/pharma/movement/exit/register-medicine-exit";
import { SelectExitType } from "@/components/selects/locate/select-exit-type";

const FormSchema = z.object({
  operatorId: z.string().optional(),
  exitDate: z.date().optional(),
  exitType: z.nativeEnum(ExitType).optional(),
});

type ExitsFiltersSchema = z.infer<typeof FormSchema>;

export function MedicineExitTableFilters() {
  const { token } = useAuth();
  const [queryOperators, setQueryOperators] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const operatorId = searchParams.get("operatorId");
  const exitDate = searchParams.get("exitDate");
  const exitType = searchParams.get("exitType") as ExitType | undefined;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      exitType: exitType ?? undefined,
    },
  });

  const { data: operatorsResult, isFetching: isFetchingOperators } = useQuery({
    queryKey: ["operators"],
    queryFn: () => fetchOperators({ page: 1 }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  function handleFilter({
    exitDate,
    exitType,
    operatorId,
  }: ExitsFiltersSchema) {
    const newParams = new URLSearchParams(searchParams);
    console.log("exitType", exitType);
    console.log("exitDate", exitDate);
    console.log("operatorId", operatorId);
    if (exitType) {
      newParams.set("exitType", exitType);
    } else {
      newParams.delete("exitType");
    }

    if (exitDate) {
      newParams.set("exitDate", exitDate.toISOString());
    } else {
      newParams.delete("exitDate");
    }

    if (operatorId) {
      newParams.set("operatorId", operatorId);
    } else {
      newParams.delete("operatorId");
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("operatorId");
      state.delete("exitDate");
      state.delete("exitType");

      state.set("page", "1");

      return state;
    });

    form.reset({
      exitDate: undefined,
      exitType: undefined,
      operatorId: "",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilter)}
        className="grid w-2/3 flex-1 grid-cols-12 items-center gap-2 space-y-1"
      >
        <FormField
          control={form.control}
          name="operatorId"
          render={({ field }) => (
            <FormItem className="col-span-8 flex flex-col gap-1">
              <FormLabel>Operador</FormLabel>
              <ComboboxUp
                field={field}
                items={operatorsResult?.operators ?? []}
                itemKey="id"
                onQueryChange={setQueryOperators}
                query={queryOperators}
                isFetching={isFetchingOperators}
                formatItem={(item) =>
                  `${item.name ?? ""} - ${getOperatorRoleTranslation(item.role) ?? ""} - ${item.email ?? ""}`
                }
                getItemText={(item) =>
                  `${item.name ?? ""} - ${getOperatorRoleTranslation(item.role) ?? ""} - ${item.email ?? ""}`
                }
                placeholder="Pesquise por um Operador"
                onSelect={(id, _) => {
                  form.setValue("operatorId", id);
                }}
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
              label="Data de Saída"
              field={field}
            />
          )}
        />
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
        <div className="col-span-12 mt-2 flex grid-cols-6 justify-end gap-2">
          <Button
            type="submit"
            variant={"secondary"}
            size={"xs"}
            className="col-span-2 flex justify-stretch"
          >
            <Search className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button
            className="col-span-2 flex justify-stretch"
            onClick={handleClearFilters}
            type="button"
            variant={"outline"}
            size={"xs"}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}
