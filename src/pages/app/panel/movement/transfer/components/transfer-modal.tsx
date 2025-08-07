"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle,
  Hash,
  Package,
  User,
} from "lucide-react";
import type { Transfer } from "../types/transfer";
import { getTransfer } from "@/api/pharma/movement/transfer/get-transfer";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import { getTransferStatusTranslation } from "@/lib/utils/translations-mappers/status-transfer-translation";
import { tr } from "date-fns/locale";
import { on } from "events";

interface TransferModalProps {
  transferId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transferId: string) => void;
}

export function TransferModal({
  transferId,
  isOpen,
  onClose,
  onConfirm,
}: TransferModalProps) {
  const { token } = useAuth();
  if (!transferId) return null;

  const { data: transfer, isLoading } = useQuery({
    queryKey: ["transfer", transferId],
    queryFn: () => getTransfer({ id: transferId }, token ?? ""),
    enabled: isOpen,
  });
  const handleConfirm = () => {
    if (transfer) {
      onConfirm(transfer.transferId);
    }
    onClose();
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
      {transfer ? (
        <div className="space-y-6">
          <div className="sticky top-0 -mx-6 -mt-6 border-b bg-background/95 px-6 pb-4 pt-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Package className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    Confirmar Recebimento
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-base">
                    Transferência {transfer?.transferId} •
                    {new Date(transfer?.transferDate).toLocaleDateString(
                      "pt-BR",
                    )}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    transfer.status === "CONFIRMED"
                      ? "default"
                      : transfer.status === "CANCELED"
                        ? "destructive"
                        : "warning"
                  }
                >
                  {getTransferStatusTranslation(transfer.status)}
                </Badge>
              </div>
            </div>
          </div>
          {/* Informações Principais */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {/* Espaçamento e margem reduzidos */}
                  <Hash className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium text-muted-foreground">
                    ID da Transferência
                  </span>
                </div>
                <p className="text-xl font-bold">{transfer.transferId}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {/* Espaçamento e margem reduzidos */}
                  <Calendar className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium text-muted-foreground">
                    Data
                  </span>
                </div>
                <p className="text-xl font-bold">
                  {new Date(transfer.transferDate).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {/* Espaçamento e margem reduzidos */}
                  <User className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium text-muted-foreground">
                    Responsável
                  </span>
                </div>
                <p className="text-lg font-bold">{transfer.operator}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {/* Espaçamento e margem reduzidos */}
                  <Package className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium text-muted-foreground">
                    Total de Itens
                  </span>
                </div>
                <p className="text-xl font-bold">{transfer.batches.length}</p>
              </CardContent>
            </Card>
          </div>
          {/* Origem e Destino */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Origem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    INSTITUIÇÃO
                  </Label>
                  <p className="mt-1 text-lg font-semibold">
                    {transfer.institutionOrigin}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    ESTOQUE
                  </Label>
                  <p className="mt-1 text-lg font-semibold">
                    {transfer.stockOrigin}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Destino
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    INSTITUIÇÃO
                  </Label>
                  <p className="mt-1 text-lg font-semibold">
                    {transfer.institutionDestination}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    ESTOQUE
                  </Label>
                  <p className="mt-1 text-lg font-semibold">
                    {transfer.stockDestination}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Fluxo Visual */}
          <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-sm font-medium">
                {transfer.institutionOrigin}
              </span>
              <ArrowRight className="h-5 w-5" />
              <span className="text-sm font-medium">
                {transfer.institutionDestination}
              </span>
            </div>
          </div>
          {/* Medicamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Medicamentos e Lotes
                </div>
                <Badge variant="outline" className="text-xs">
                  {transfer.batches.length}
                  {transfer.batches.length === 1 ? "item" : "itens"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-sm font-semibold">
                        Medicamento
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Lote
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Quantidade
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Validade
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfer.batches.map((batch, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm font-medium">
                          {batch.medicine} - {batch.dosage}
                          {batch.unitMeasure} - {batch.pharmaceuticalForm}
                          {batch.complement ? ` - ${batch.complement}` : ""}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            {batch.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-base font-semibold">
                          {batch.quantity}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(batch.expirationDate).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Footer com Botões */}
          <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-background/95 px-6 pb-6 pt-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Ao confirmar, a transferência será finalizada e os medicamentos
                serão adicionados ao estoque de destino.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Confirmar Recebimento
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </DialogContent>
  );
}
