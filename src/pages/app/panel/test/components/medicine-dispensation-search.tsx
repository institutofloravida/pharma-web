"use client";

import { useState } from "react";
import { ChevronsUpDown, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchMedicinesOnStock,
  type MedicineStockDetails,
} from "@/api/pharma/stock/medicine-stock/fetch-medicines-stock";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";

interface MedicineDispensationSearchProps {
  onAdd: (medicine: MedicineStockDetails, quantity: number) => void;
  selectedMedicines: MedicineStockDetails[];
  stockId: string;
}

export function MedicineDispensationSearch({
  onAdd,
  selectedMedicines,
  stockId,
}: MedicineDispensationSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineStockDetails | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const { token } = useAuth();

  const { data: medicinesStockResult, isFetching: isFetchingMedicinesStock } =
    useQuery({
      queryKey: ["medicines-stock", stockId, searchValue],
      queryFn: () =>
        fetchMedicinesOnStock(
          {
            page: 1,
            stockId: stockId,
            medicineName: searchValue,
          },
          token ?? "",
        ),
      staleTime: 1000,
      enabled: !!stockId,
      refetchOnMount: true,
    });

  const availableMedicines = medicinesStockResult?.medicines_stock.filter(
    (med) =>
      !selectedMedicines.some((selected) => selected.id === med.id) &&
      med.quantity.available > 0,
  );

  const handleSelectMedicine = (medicine: MedicineStockDetails) => {
    setSelectedMedicine(medicine);
    setQuantity(0);
    setSearchValue("");
  };

  const handleAdd = () => {
    if (
      selectedMedicine &&
      quantity > 0 &&
      quantity <= selectedMedicine.quantity.available
    ) {
      onAdd(selectedMedicine, quantity);
      setSelectedMedicine(null);
      setQuantity(1);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedMedicine(null);
    setQuantity(0);
    setOpen(false);
  };

  if (!stockId) {
    return (
      <Button
        variant="outline"
        disabled
        className="h-12 w-full justify-between bg-transparent text-left"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Selecione um estoque primeiro...
          </span>
        </div>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-full justify-between bg-transparent text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Pesquisar medicamento para dispensar...
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        {!selectedMedicine ? (
          <Command>
            <CommandInput
              placeholder="Digite o nome do medicamento..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>Nenhum medicamento encontrado.</CommandEmpty>
              <CommandGroup>
                {availableMedicines &&
                  availableMedicines.map((medicine) => (
                    <CommandItem
                      key={medicine.id}
                      value={medicine.medicine}
                      onSelect={() => handleSelectMedicine(medicine)}
                      className="cursor-pointer"
                    >
                      <div className="flex w-full flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">
                            {medicine.medicine} • {medicine.pharmaceuticalForm}{" "}
                            • {medicine.dosage}
                            {medicine.unitMeasure}
                            {medicine.complement &&
                            medicine.complement.length > 0
                              ? ` • ${medicine.complement}`
                              : ""}
                          </span>
                          <div className="text-sm">
                            <span className="text-green-600">
                              {medicine.quantity.available} disp.
                            </span>
                            {medicine.quantity.unavailable > 0 && (
                              <span className="ml-2 text-red-500">
                                {medicine.quantity.unavailable} indis.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <div className="space-y-4 p-4">
            <div>
              <h4 className="text-sm font-medium">Medicamento Selecionado</h4>
              <p className="text-sm text-muted-foreground">
                {selectedMedicine.medicine} -{" "}
                {selectedMedicine.pharmaceuticalForm} -{" "}
                {selectedMedicine.dosage}
                {selectedMedicine.unitMeasure}
              </p>
              <p className="text-xs text-green-600">
                Disponível: {selectedMedicine.quantity.available}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm">
                Quantidade para dispensar
              </Label>
              <Input
                id="quantity"
                type="number"
                defaultValue={0}
                min={0}
                max={selectedMedicine.quantity.available}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number.parseInt(e.target.value) || 0)
                }
                className="h-8"
              />
              {quantity > selectedMedicine.quantity.available && (
                <p className="text-xs text-red-500">
                  Quantidade excede o estoque disponível
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-transparent"
                size="sm"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={
                  quantity <= 0 ||
                  quantity > selectedMedicine.quantity.available
                }
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
