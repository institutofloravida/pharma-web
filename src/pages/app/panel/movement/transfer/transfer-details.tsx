import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Hash,
  Package,
  User,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { getTransfer } from '@/api/pharma/movement/transfer/get-transfer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'
import { getTransferStatusTranslation } from '@/lib/utils/translations-mappers/status-transfer-translation'
import { TransferStatus } from '@/api/pharma/movement/transfer/fetch-transfer'

export function TransferDetails() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: transfer, isLoading } = useQuery({
    queryKey: ['transfer', id],
    queryFn: () => getTransfer({ id: id ?? '' }, token ?? ''),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Carregando dados...</span>
      </div>
    )
  }

  if (!transfer) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        Transferência não encontrada.
      </div>
    )
  }

  const statusVariant =
    transfer.status === TransferStatus.COMPLETED
      ? 'default'
      : transfer.status === TransferStatus.CANCELLED
        ? 'destructive'
        : 'warning'

  return (
    <div className="container mx-auto py-6">
      <Card className="border-none shadow-md">
        <CardHeader className="rounded-t-lg bg-secondary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-secondary-foreground">
                Detalhes da Transferência
              </CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Visualização completa dos itens registrados na transferência
              </CardDescription>
            </div>
            <Package className="h-8 w-8 text-secondary-foreground" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Transferências
            </Button>
          </div>

          {/* Informações gerais */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                ID da Transferência
              </span>
              <span className="font-mono text-sm font-medium">
                {transfer.transferId}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Data
              </span>
              <span className="font-medium">
                {new Date(transfer.transferDate).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Operador
              </span>
              <span className="font-medium">{transfer.operator}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                Status
              </span>
              <Badge variant={statusVariant} className="w-fit">
                {getTransferStatusTranslation(transfer.status)}
              </Badge>
            </div>

            {transfer.confirmedAt && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Confirmada em
                </span>
                <span className="font-medium">
                  {new Date(transfer.confirmedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          {/* Origem → Destino */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" />
                  Origem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    INSTITUIÇÃO
                  </p>
                  <p className="mt-0.5 font-semibold">
                    {transfer.institutionOrigin}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    ESTOQUE
                  </p>
                  <p className="mt-0.5 font-semibold">{transfer.stockOrigin}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" />
                  Destino
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    INSTITUIÇÃO
                  </p>
                  <p className="mt-0.5 font-semibold">
                    {transfer.institutionDestination ?? '—'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    ESTOQUE
                  </p>
                  <p className="mt-0.5 font-semibold">
                    {transfer.stockDestination}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex items-center justify-center gap-3 text-muted-foreground">
            <span className="text-sm font-medium">
              {transfer.institutionOrigin}
            </span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm font-medium">
              {transfer.institutionDestination ?? transfer.stockDestination}
            </span>
          </div>

          {/* Lotes */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5" />
              Medicamentos e Lotes ({transfer.batches.length})
            </h3>

            <Card className="shadow-sm">
              <CardContent className="p-0">
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
                          Fabricante
                        </TableHead>
                        <TableHead className="text-center text-sm font-semibold">
                          Validade
                        </TableHead>
                        <TableHead className="text-right text-sm font-semibold">
                          Qtd.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transfer.batches.map((batch) => (
                        <TableRow key={batch.batchId}>
                          <TableCell className="text-sm font-medium">
                            {batch.medicine} — {batch.dosage}
                            {batch.unitMeasure} — {batch.pharmaceuticalForm}
                            {batch.complement ? ` — ${batch.complement}` : ''}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs"
                            >
                              {batch.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {batch.manufacturer}
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {new Date(batch.expirationDate).toLocaleDateString(
                              'pt-BR',
                            )}
                          </TableCell>
                          <TableCell className="text-right text-base font-semibold">
                            {batch.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
