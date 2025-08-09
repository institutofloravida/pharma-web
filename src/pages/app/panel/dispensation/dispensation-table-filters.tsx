import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchUsers } from "@/api/pharma/users/fetch-users";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/authContext";
import { cn } from "@/lib/utils";
import { Formatter } from "@/lib/utils/formaters/formaters";
import { dateFormatter } from "@/lib/utils/formatter";
import { DatePickerFormItem } from "@/components/date/date-picker-form-item";

const DispensationsFiltersSchema = z.object({
  patientId: z.string().optional(),
  dispensationDate: z.date().optional(),
});

type DispensationsFiltersSchema = z.infer<typeof DispensationsFiltersSchema>;

export function DispensationTableFilters() {
  const { token } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [queryUsers, setQueryUsers] = useState("");

  const patientId = searchParams.get("patientId");
  const dispensationDate = searchParams.get("dispensationDate");

  const { data: usersResult, isFetching: isFetchingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers({ page: 1 }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const form = useForm<DispensationsFiltersSchema>({
    resolver: zodResolver(DispensationsFiltersSchema),
    defaultValues: {
      dispensationDate: dispensationDate
        ? new Date(dispensationDate)
        : undefined,
      patientId: patientId ?? "",
    },
  });

  function handleFilter({
    dispensationDate,
    patientId,
  }: DispensationsFiltersSchema) {
    const newParams = new URLSearchParams(searchParams);

    if (patientId) {
      newParams.set("patientId", patientId);
    } else {
      newParams.delete("patientId");
    }

    if (dispensationDate) {
      newParams.set("dispensationDate", dispensationDate.toISOString());
    } else {
      newParams.delete("dispensationDate");
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("patientId");
      state.delete("dispensationDate");
      state.set("page", "1");

      return state;
    });

    form.reset({
      patientId: "",
      dispensationDate: undefined,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilter)}
        className="grid grid-cols-12 space-x-2 space-y-1"
      >
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem className="col-span-6 flex flex-col gap-1">
              <ComboboxUp
                field={field}
                items={usersResult?.patients ?? []}
                itemKey="id"
                onQueryChange={setQueryUsers}
                query={queryUsers}
                isFetching={isFetchingUsers}
                formatItem={(item) =>
                  `${Formatter.cpf(item.sus)} - ${item.name} - ${dateFormatter.format(new Date(item.birthDate))}`
                }
                getItemText={(item) =>
                  `${Formatter.cpf(item.sus)} - ${item.name} - ${dateFormatter.format(new Date(item.birthDate))}`
                }
                placeholder="Pesquise por um usuário"
                onSelect={(item) => {
                  form.setValue("patientId", item);
                }}
              />
              <FormDescription>
                Pesquise por cpf, nome ou data de nascimento{" "}
              </FormDescription>
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
            />
          )}
        />
        <Button
          type="submit"
          variant={"secondary"}
          size={"xs"}
          className="col-span-2"
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        <Button
          className="col-span-2"
          type="button"
          onClick={handleClearFilters}
          variant={"outline"}
          size={"xs"}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </form>
    </Form>
  );
}
