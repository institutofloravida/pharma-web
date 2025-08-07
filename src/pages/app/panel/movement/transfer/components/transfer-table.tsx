"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
import type { Transfer } from "../types/transfer";

interface TransferTableProps {
  transfers: Transfer[];
  onConfirmTransfer: (transfer: Transfer) => void;
}

export function TransferTable({
  transfers,
  onConfirmTransfer,
}: TransferTableProps) {
  const getStatusBadge = (status: Transfer["status"]) => {
    const variants = {
      pendente: "secondary",
      confirmado: "default",
      cancelado: "destructive",
    } as const;

    const labels = {
      pendente: "Pendente",
      confirmado: "Confirmado",
      cancelado: "Cancelado",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Transferências</CardTitle>
        <CardDescription>
          {transfers.length} transferência(s) encontrada(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.id}</TableCell>
                  <TableCell>
                    {new Date(transfer.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transfer.originInstitution}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transfer.originStock}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transfer.destinationInstitution}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transfer.destinationStock}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{transfer.responsible}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell className="text-right">
                    {transfer.status === "pendente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onConfirmTransfer(transfer)}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirmar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
