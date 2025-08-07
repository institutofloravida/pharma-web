"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TransferFilters } from "../types/transfer";

interface TransferFiltersProps {
  filters: TransferFilters;
  onFiltersChange: (filters: TransferFilters) => void;
}

export function TransferFiltersComponent({
  filters,
  onFiltersChange,
}: TransferFiltersProps) {
  const updateFilter = (key: keyof TransferFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      originInstitution: "",
      destinationInstitution: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Filtre as transferências por status, instituição ou período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin">Instituição Origem</Label>
            <Input
              id="origin"
              placeholder="Filtrar por origem"
              value={filters.originInstitution}
              onChange={(e) =>
                updateFilter("originInstitution", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Instituição Destino</Label>
            <Input
              id="destination"
              placeholder="Filtrar por destino"
              value={filters.destinationInstitution}
              onChange={(e) =>
                updateFilter("destinationInstitution", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFrom">Data Inicial</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Data Final</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
