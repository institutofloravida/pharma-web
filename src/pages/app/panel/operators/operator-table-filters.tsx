import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchInstitutions } from "@/api/pharma/auxiliary-records/institution/fetch-institutions";
import { OperatorRole } from "@/api/pharma/operators/register-operator";
import { Combobox } from "@/components/comboboxes/combobox";
import { SelectRole } from "@/components/selects/select-role";
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

const unitsmeasureFiltersSchema = z.object({
  name: z.string().optional(),
  institutionId: z.string().optional(),
  role: z.nativeEnum(OperatorRole).optional().or(z.literal("")),
  email: z.string().email().or(z.literal("")),
});

type UnitsMeasureFiltersSchema = z.infer<typeof unitsmeasureFiltersSchema>;

export function OperatorTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInstitution, setQueryInstitution] = useState("");

  const { token } = useAuth();

  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const institutionId = searchParams.get("institutionId");
  const role = searchParams.get("role");

  const form = useForm<UnitsMeasureFiltersSchema>({
    resolver: zodResolver(unitsmeasureFiltersSchema),
    defaultValues: {
      name: name ?? "",
      email: email ?? "",
      institutionId: institutionId ?? "",
      role:
        role && Object.values(OperatorRole).includes(role as OperatorRole)
          ? (role as OperatorRole)
          : undefined,
    },
  });

  function handleFilter({
    name,
    email,
    institutionId,
    role,
  }: UnitsMeasureFiltersSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set("name", name);
      } else {
        state.delete("name");
      }

      if (email) {
        state.set("email", email);
      } else {
        state.delete("email");
      }

      if (institutionId) {
        state.set("institutionId", institutionId);
      } else {
        state.delete("institutionId");
      }

      if (role) {
        state.set("role", role);
      } else {
        state.delete("role");
      }

      state.set("page", "1");

      return state;
    });
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("name");
      state.delete("email");
      state.delete("institutionId");
      state.delete("role");
      state.set("page", "1");

      return state;
    });

    form.reset({
      name: "",
      email: "",
      institutionId: "",
      role: undefined,
    });
  }

  const { data: institutionsResult, isFetching: isFetchingInstitutions } =
    useQuery({
      queryKey: ["institutions", queryInstitution],
      queryFn: () =>
        fetchInstitutions({ page: 1, query: queryInstitution }, token ?? ""),
      enabled: queryInstitution !== null,
      staleTime: 1000,
      refetchOnMount: true,
    });

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 grid-rows-2 gap-1 space-x-2 space-y-1 p-2"
        onSubmit={form.handleSubmit(handleFilter)}
      >
        <span className="col-span-1 self-center justify-self-center text-sm font-semibold">
          Filtros:
        </span>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-6 h-8">
              <FormControl>
                <Input placeholder="Nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-5 h-8">
              <FormControl>
                <Input type="email" placeholder="Email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="institutionId"
          render={({ field }) => (
            <FormItem className="col-span-5">
              <Combobox
                items={institutionsResult?.institutions || []}
                field={field}
                query={queryInstitution}
                placeholder="Selecione uma instituição "
                isFetching={isFetchingInstitutions}
                onQueryChange={setQueryInstitution}
                onSelect={(id, name) => {
                  form.setValue("institutionId", id);
                  setQueryInstitution(name);
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
          name="role"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <SelectRole
                onChange={field.onChange}
                value={field.value || undefined}
              />
              <FormMessage />
            </FormItem>
          )}
        />

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
      </form>
    </Form>
  );
}
