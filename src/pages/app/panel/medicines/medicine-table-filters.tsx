import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchTherapeuticClasses } from "@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class";
import { ComboboxMany } from "@/components/comboboxes/combobox-many";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authContext";

const MedicinesFiltersSchema = z.object({
  name: z.string().optional(),
  therapeuticClassesIds: z.array(z.string()).default([]),
});

type MedicinesFiltersSchema = z.infer<typeof MedicinesFiltersSchema>;

export function MedicineTableFilters() {
  const { token } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const [queryTherapeuticClass, setqueryTherapeuticClass] = useState("");

  const name = searchParams.get("name");
  const therapeuticClassesIds = searchParams.get("therapeuticClassesIds")
    ? searchParams.get("therapeuticClassesIds")!.split(",")
    : [];

  const {
    data: therapeuticClassesResult,
    isFetching: isFetchingtherapeuticClasses,
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

  const form = useForm<MedicinesFiltersSchema>({
    resolver: zodResolver(MedicinesFiltersSchema),
    defaultValues: {
      name: name ?? "",
      therapeuticClassesIds: therapeuticClassesIds ?? "",
    },
  });

  function handleFilter({
    name,
    therapeuticClassesIds,
  }: MedicinesFiltersSchema) {
    const newParams = new URLSearchParams(searchParams);

    if (name) {
      newParams.set("name", name);
    } else {
      newParams.delete("name");
    }

    if (therapeuticClassesIds.length > 0) {
      newParams.set("therapeuticClassesIds", therapeuticClassesIds.join(","));
    } else {
      newParams.delete("therapeuticClassesIds");
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("name");
      state.delete("therapeuticClassesIds");
      state.set("page", "1");

      return state;
    });

    form.reset({
      name: "",
      therapeuticClassesIds: [],
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
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormControl>
                <Input placeholder="Nome do Medicamento..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"secondary"}
          size={"xs"}
          className="col-span-3"
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          className="col-span-3"
          type="button"
          onClick={handleClearFilters}
          variant={"outline"}
          size={"xs"}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
        <FormField
          control={form.control}
          name="therapeuticClassesIds"
          render={({ field }) => (
            <FormItem className="col-span-3">
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
                isFetching={isFetchingtherapeuticClasses}
                formatItem={(item) => `${item.name}`}
                placeholder="Classes Terapêuticas"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
