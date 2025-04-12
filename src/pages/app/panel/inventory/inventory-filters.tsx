import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search, View, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { fetchMedicines } from "@/api/pharma/medicines/fetch-medicines";
import { Combobox } from "@/components/comboboxes/pharmaceutical-form-combobox";
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
import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import { ComboboxMany } from "@/components/comboboxes/combobox-many";
import { fetchTherapeuticClasses } from "@/api/pharma/auxiliary-records/therapeutic-class/fetch-therapeutic-class";
import { Checkbox } from "@/components/ui/checkbox";

enum ViewMode {
  LIST = "LIST",
  GRID = "GRID",
}

const inventoryFiltersSchema = z.object({
  stockId: z.string().optional(),
  medicineName: z.string().optional(),
  therapeuticClassesIds: z.array(z.string()).default([]),
  isLowStock: z.coerce.boolean().default(false),
});

type InventoryFiltersSchema = z.infer<typeof inventoryFiltersSchema>;

export function InventoryTableFilters() {
  const { token } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [queryStock, setQueryStock] = useState("");
  const [queryTherapeuticClass, setqueryTherapeuticClass] = useState("");


  const medicineName = searchParams.get("medicineName");
  const stockId = searchParams.get("stockId");
  const therapeuticClassesIds = searchParams.get("therapeuticClassesIds")
    ? searchParams.get("therapeuticClassesIds")!.split(",")
    : [];

  const isLowStock = searchParams.get('isLowStock')

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks", queryStock],
    queryFn: () => fetchStocks({ page: 1, query: queryStock }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

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

  const form = useForm<InventoryFiltersSchema>({
    resolver: zodResolver(inventoryFiltersSchema),
    defaultValues: {
      medicineName: medicineName ?? "",
      isLowStock: Boolean(isLowStock),
      stockId: stockId ?? "",
      therapeuticClassesIds: therapeuticClassesIds ?? "",
    },
  });

  function handleFilter({
    therapeuticClassesIds,
    isLowStock,
    medicineName,
    stockId,
  }: InventoryFiltersSchema) {
    const newParams = new URLSearchParams(searchParams);

    if (stockId) {
      newParams.set("stockId", stockId);
    } else {
      newParams.delete("stockId");
    }

    if (medicineName) {
      newParams.set("medicineName", medicineName);
    } else {
      newParams.delete("medicineName");
    }

    if (therapeuticClassesIds.length > 0) {
      newParams.set("therapeuticClassesIds", therapeuticClassesIds.join(","));
    } else {
      newParams.delete("therapeuticClassesIds");
    }

    if (isLowStock) {
      newParams.set("isLowStock", String(isLowStock));
    } else {
      newParams.delete("isLowStock");
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("medicineName");
      state.delete("stockId");
      state.delete("therapeuticClassesIds")
      state.delete("isLowStock");
      state.set("page", "1");

      return state;
    });

    form.reset({
      medicineName: "",
      isLowStock: false,
      stockId: "",
      therapeuticClassesIds: []
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilter)}
        className="grid grid-cols-6 items-center space-x-2 space-y-1 p-2"
      >
        <FormField
          control={form.control}
          name="medicineName"
          render={({ field }) => (
            <FormItem className="col-span-2 grid">
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
            <FormItem className="col-span-2">
              <Combobox
                items={stocksResult?.stocks || []}
                field={{ value: field.value ?? "" }}
                query={queryStock}
                placeholder="Estoque específico "
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

        <FormField
          control={form.control}
          name="isLowStock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Estoque Baixo?
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={"secondary"}
          size={"xs"}
          className="col-span-1"
        >
          <Search className="mr-2 h-4 w-4" />
          Filtrar Resultados
        </Button>
        <Button
          className="col-span-1"
          type="button"
          onClick={handleClearFilters}
          variant={"outline"}
          size={"xs"}
        >
          <X className="mr-2 h-4 w-4" />
          Remover Filtros
        </Button>
      </form>
    </Form>
  );
}

// export function MedicationFilters({
//   searchTerm,
//   onSearchChange,
//   viewMode,
//   onViewModeChange,
// }: MedicationFiltersProps) {
//   return (
//     <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//       <div className="relative w-full md:w-96">
//         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//         <Input
//           type="search"
//           placeholder="Buscar medicamentos..."
//           className="w-full pl-8"
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//       </div>
//       <div className="flex w-full gap-2 md:w-auto">
//         <div className="flex items-center overflow-hidden rounded-md border dark:border-border">
//           <Button
//             variant={viewMode === 'list' ? 'default' : 'ghost'}
//             size="sm"
//             onClick={() => onViewModeChange('list')}
//             className="rounded-none"
//           >
//             <List className="mr-1 h-4 w-4" />
//             Lista
//           </Button>
//           <Button
//             variant={viewMode === 'grid' ? 'default' : 'ghost'}
//             size="sm"
//             onClick={() => onViewModeChange('grid')}
//             className="rounded-none"
//           >
//             <Grid className="mr-1 h-4 w-4" />
//             Grade
//           </Button>
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="flex gap-2">
//               <Filter className="h-4 w-4" />
//               Filtrar
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => onSearchChange('Analgésico')}>
//               Analgésicos
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onSearchChange('Antibiótico')}>
//               Antibióticos
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => onSearchChange('Anti-inflamatório')}
//             >
//               Anti-inflamatórios
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onSearchChange('')}>
//               Limpar filtros
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   )
// }
