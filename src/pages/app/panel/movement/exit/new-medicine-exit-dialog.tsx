import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchMovementTypes } from "@/api/pharma/auxiliary-records/movement-type/fetch-movement-types";
import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import {
  ExitType,
  registerMedicineExit,
  type RegisterMedicineExitBodyAndParams,
} from "@/api/pharma/movement/exit/register-medicine-exit";
import {
  type BatchestockDetails,
  fetchBatchesOnStock,
} from "@/api/pharma/stock/bacth-stock/fetch-batches-stock";
import { fetchMedicinesOnStock } from "@/api/pharma/stock/medicine-stock/fetch-medicines-stock";
import { ComboboxUp } from "@/components/comboboxes/combobox-up";
import { SelectExitType } from "@/components/selects/locate/select-exit-type";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { dateFormatter } from "@/lib/utils/formatter";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { MovementTypeDirection } from "@/lib/utils/movement-type";

const FormSchema = z
  .object({
    stockId: z.string({
      required_error: "Selecione um estoque.",
    }),
    medicineStockId: z.string({
      required_error: "Selecione um medicamento.",
    }),
    movementTypeId: z.string().optional(),
    exitType: z.nativeEnum(ExitType),
    batchStockId: z.string({
      required_error: "Selecione um lote.",
    }),
    quantity: z.coerce
      .number({
        required_error: "A quantidade é obrigatória.",
      })
      .min(1, "Quantidade mínima: 1."),
    exitDate: z.date({
      required_error: "Selecione uma data válida",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.exitType === ExitType.MOVEMENT_TYPE && !data.movementTypeId) {
      ctx.addIssue({
        path: ["movementTypeId"],
        code: z.ZodIssueCode.custom,
        message: "Selecione um tipo de movimentação.",
      });
    }
  });

export function NewMedicineExitDialog() {
  const [queryStock, setQueryStock] = useState("");
  const [queryMedicineStock, setQueryMedicineStock] = useState("");
  const [queryBatchesStock, setQueryBatchesStock] = useState("");
  const [queryMovementType, setQueryMovementType] = useState("");

  const [selectedBatch, setSelectedBatch] = useState<BatchestockDetails | null>(
    null,
  );

  const { token } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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

  const { data: medicinesStockResult, isFetching: isFetchingMedicinesStock } =
    useQuery({
      queryKey: ["medicines-stock", form.watch("stockId"), queryMedicineStock],
      queryFn: () =>
        fetchMedicinesOnStock(
          {
            page: 1,
            stockId: form.watch("stockId"),
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
            medicineStockId: form.watch("medicineStockId"),
            code: queryBatchesStock,
          },
          token ?? "",
        ),
      staleTime: 1000,
      enabled: !!form.watch("medicineStockId"),
      refetchOnMount: true,
    });

  const { data: stocksResult, isFetching: isFetchingStocks } = useQuery({
    queryKey: ["stocks", queryStock],
    queryFn: () => fetchStocks({ page: 1, query: queryStock }, token ?? ""),
    staleTime: 1000,
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const quantity = Number(form.getValues("quantity"));
      const availableQuantity = Number(selectedBatch?.quantity ?? 0);
      if (quantity > availableQuantity) {
        form.setError("quantity", {
          type: "manual",
          message: `Quantidade indisponível. Estoque: ${availableQuantity}`,
        });
        return;
      }
      await registerMedicineExitFn({
        batcheStockId: data.batchStockId,
        exitDate: data.exitDate,
        exitType: data.exitType,
        medicineStockId: data.medicineStockId,
        quantity: data.quantity,
        movementTypeId: data.movementTypeId,
      });

      toast({
        title: "Saída de Medicamento",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      toast({
        title: "Erro ao registrar saída",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent className="flex max-w-[800px] flex-col items-center">
      <DialogHeader className="items-center">
        <DialogTitle>Nova Saída</DialogTitle>
        <DialogDescription>
          Preencha os dados para registrar uma nova saída de medicamento.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-[800px] grid-cols-6 space-x-2 space-y-2"
        >
          <FormField
            control={form.control}
            name="exitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Saída</FormLabel>
                <SelectExitType onChange={field.onChange} value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockId"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col">
                <FormLabel>Estoque</FormLabel>
                <ComboboxUp
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
            name="medicineStockId"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-col">
                <FormLabel>Medicamento</FormLabel>
                <ComboboxUp
                  items={medicinesStockResult?.medicines_stock ?? []}
                  field={field}
                  query={queryMedicineStock}
                  placeholder="Selecione um medicamento"
                  isFetching={isFetchingMedicinesStock}
                  onQueryChange={setQueryMedicineStock}
                  onSelect={(id, item) => {
                    form.setValue("medicineStockId", id);
                    form.setValue("quantity", 0);
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
                      <div className="text-sm">
                        <span className="text-green-600">
                          {item.quantity.available} disp.
                        </span>
                        {item.quantity.unavailable > 0 && (
                          <span className="ml-2 text-red-500">
                            {item.quantity.unavailable} indis.
                          </span>
                        )}
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

          <FormField
            control={form.control}
            name="batchStockId"
            render={({ field }) => (
              <FormItem className="col-span-6 flex flex-col">
                <FormLabel>Lote</FormLabel>
                <ComboboxUp
                  items={batchesStockResult?.batches_stock ?? []}
                  field={field}
                  query={queryBatchesStock}
                  placeholder="Selecione um lote"
                  isFetching={isFetchingBatchesStock}
                  onQueryChange={setQueryBatchesStock}
                  onSelect={(id, item) => {
                    form.setValue("batchStockId", id);
                    form.setValue("quantity", 0);
                    setSelectedBatch(item);
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

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    // max={selectedBatch?.quantity ?? undefined}
                    placeholder="quantidade do lote"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exitDate"
            defaultValue={new Date()}
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-col gap-1">
                <FormLabel>Data de Saída</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      lang="pt-BR"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="col-span-6 grid justify-end">
            <div className="flex-gap-2">
              <DialogClose asChild>
                <Button variant={"ghost"}>Cancelar</Button>
              </DialogClose>
              <Button type="submit">Enviar</Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
