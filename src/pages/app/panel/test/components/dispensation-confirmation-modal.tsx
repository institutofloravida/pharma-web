"use client";

import {
  Calendar,
  User as UserIcon,
  Package,
  MapPin,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DispensationMedicine } from "../types/dispensation";
import type { User } from "@/api/pharma/users/fetch-users";
import type { Stock } from "../../movement/exit/types/medicine-exit";

interface DispensationConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  patient: User | null;
  stock: Stock | null;
  dispensationDate: Date;
  medicines: DispensationMedicine[];
}

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function DispensationConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  patient,
  stock,
  dispensationDate,
  medicines,
}: DispensationConfirmationModalProps) {
  const totalMedicines = medicines.length;
  const totalBatches = medicines.reduce(
    (sum, medicine) => sum + medicine.batches.length,
    0,
  );
  const totalQuantity = medicines.reduce(
    (sum, medicine) =>
      sum +
      medicine.batches.reduce(
        (batchSum, batch) => batchSum + batch.quantity.toDispensation,
        0,
      ),
    0,
  );

  const getBatchStatusVariant = (daysToExpire: number) => {
    if (daysToExpire > 90) return "default";
    if (daysToExpire > 30) return "warning";
    return "destructive";
  };

  const getBatchStatusText = (daysToExpire: number) => {
    if (daysToExpire > 90) return "Válido";
    if (daysToExpire > 30) return "Menos de 90d";
    return "Menos de 30d";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Confirmar Dispensação
          </DialogTitle>
          <DialogDescription className="text-sm">
            Revise todas as informações antes de confirmar a dispensação. Esta
            ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-4">
            {/* Informações Gerais */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Paciente */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-3 w-3 text-emerald-600" />
                    Usuário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 pt-0">
                  <p className="text-base font-medium">{patient?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    SUS: {patient ? formatCPF(patient.sus) : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nascimento: {patient ? formatDate(patient.birthDate) : ""}
                  </p>
                </CardContent>
              </Card>

              {/* Informações da Dispensação */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-3 w-3 text-green-600" />
                    Detalhes da Dispensação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">
                      Data: {formatDate(dispensationDate.toString())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">Estoque: {stock?.name}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge
                      variant="secondary"
                      className="h-5 px-1 py-0 text-xs"
                    >
                      {totalMedicines} med.
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="h-5 px-1 py-0 text-xs"
                    >
                      {totalBatches} lotes
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="h-5 px-1 py-0 text-xs"
                    >
                      {totalQuantity} un.
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Medicamentos */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Package className="h-3 w-3 text-emerald-600" />
                  Medicamentos a Dispensar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {medicines.map((medicine, index) => {
                  const totalMedicineQuantity = medicine.batches.reduce(
                    (sum, batch) => sum + batch.quantity.toDispensation,
                    0,
                  );

                  return (
                    <Card
                      key={medicine.id}
                      className="border-l-2 border-l-emerald-500"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm leading-tight">
                              {medicine.medicine.medicine} -{" "}
                              {medicine.medicine.pharmaceuticalForm} -{" "}
                              {medicine.medicine.dosage}
                              {medicine.medicine.unitMeasure}
                              {medicine.medicine.complement &&
                              medicine.medicine.complement.length > 0
                                ? ` • ${medicine.medicine.complement}`
                                : ""}
                            </CardTitle>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>
                                Total: {medicine.medicine.quantity.available}
                              </span>
                              <span className="font-medium text-green-600">
                                Dispensando: {medicine.quantityRequested}
                              </span>
                              {totalMedicineQuantity <
                                medicine.quantityRequested && (
                                <span className="text-orange-600">
                                  Falt:{" "}
                                  {medicine.quantityRequested -
                                    totalMedicineQuantity}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="h-5 shrink-0 px-1 py-0 text-xs"
                          >
                            {medicine.batches.length}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="h-8">
                              <TableHead className="h-8 py-1 text-xs">
                                Lote
                              </TableHead>
                              <TableHead className="h-8 py-1 text-xs">
                                Fabricante
                              </TableHead>
                              <TableHead className="h-8 py-1 text-xs">
                                Validade
                              </TableHead>
                              <TableHead className="h-8 py-1 text-center text-xs">
                                Estoque
                              </TableHead>
                              <TableHead className="h-8 py-1 text-center text-xs">
                                Dispensar
                              </TableHead>
                              <TableHead className="h-8 py-1 text-center text-xs">
                                Status/Vencimento
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medicine.batches.map((batch) => {
                              const daysToExpire = Math.ceil(
                                (new Date(batch.expirationDate).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24),
                              );

                              return (
                                <TableRow
                                  key={batch.batchStockId}
                                  className="h-10"
                                >
                                  <TableCell className="py-1 font-mono text-xs">
                                    {batch.code}
                                  </TableCell>
                                  <TableCell className="py-1 text-xs text-muted-foreground">
                                    {batch.manufacturerName}
                                  </TableCell>
                                  <TableCell className="py-1">
                                    <div className="flex flex-col">
                                      <span className="text-xs">
                                        {formatDate(
                                          batch.expirationDate.toString(),
                                        )}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {daysToExpire}d
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-1 text-center text-xs">
                                    {batch.quantity.totalCurrent}
                                  </TableCell>
                                  <TableCell className="py-1 text-center">
                                    <Badge
                                      variant="outline"
                                      className="h-5 px-1 py-0 text-xs text-emerald-600"
                                    >
                                      {batch.quantity.toDispensation}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="py-1 text-center">
                                    <Badge
                                      variant={getBatchStatusVariant(
                                        daysToExpire,
                                      )}
                                      className="h-5 px-1 py-0 text-xs"
                                    >
                                      {getBatchStatusText(daysToExpire)}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Resumo Final */}
            <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-800 dark:text-emerald-200">
                  Resumo da Dispensação
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {totalMedicines}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      Medicamento(s)
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {totalBatches}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      Lote(s)
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {totalQuantity}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                      Unidade(s)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aviso */}
            <Alert>
              <AlertTriangle className="h-3 w-3" />
              <AlertDescription className="text-xs">
                <strong>Atenção:</strong> Após confirmar, esta dispensação será
                registrada no sistema e não poderá ser desfeita. Verifique todas
                as informações antes de prosseguir.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            size="sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
            size="sm"
          >
            {isLoading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3" />
                Confirmar Dispensação
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
