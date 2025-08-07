"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Search } from "lucide-react";
import { useState } from "react";

import { fetchMedicinesOnStock } from "@/api/pharma/stock/medicine-stock/fetch-medicines-stock";
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
import { useAuth } from "@/contexts/authContext";

import type { MedicineStock } from "../types/medicine-exit";

interface MedicineStockSearchProps {
  onSelect: (medicine: MedicineStock) => void;
  selectedMedicines: MedicineStock[];
  stockId: string;
}

// Mock data - substitua pela sua API
const mockMedicinesStock: MedicineStock[] = [
  {
    id: "1",
    medicine: "Paracetamol",
    pharmaceuticalForm: "Comprimido",
    dosage: "500mg",
    unitMeasure: "mg",
    quantity: { available: 100, unavailable: 0 },
  },
  {
    id: "2",
    medicine: "Ibuprofeno",
    pharmaceuticalForm: "Comprimido",
    dosage: "600mg",
    unitMeasure: "mg",
    quantity: { available: 50, unavailable: 10 },
  },
  {
    id: "3",
    medicine: "Amoxicilina",
    pharmaceuticalForm: "Cápsula",
    dosage: "500mg",
    unitMeasure: "mg",
    quantity: { available: 75, unavailable: 5 },
  },
];

export function MedicineStockSearch({
  onSelect,
  selectedMedicines,
  stockId,
}: MedicineStockSearchProps) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [queryMedicineStock, setQueryMedicineStock] = useState("");

  const { data: medicinesStockResult, isFetching: isFetchingMedicinesStock } =
    useQuery({
      queryKey: ["medicines-stock", stockId, queryMedicineStock],
      queryFn: () =>
        fetchMedicinesOnStock(
          {
            page: 1,
            stockId,
            medicineName: queryMedicineStock,
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

  const handleSelect = (medicine: MedicineStock) => {
    onSelect(medicine);
    setOpen(false);
    setSearchValue("");
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
              Pesquisar medicamento...
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
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
                    onSelect={() => handleSelect(medicine)}
                    className="cursor-pointer"
                  >
                    <div className="flex w-full flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">
                          {medicine.medicine} • {medicine.pharmaceuticalForm} •{" "}
                          {medicine.dosage}
                          {medicine.unitMeasure}{" "}
                          {medicine.complement && `• ${medicine.complement}`}
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
      </PopoverContent>
    </Popover>
  );
}
