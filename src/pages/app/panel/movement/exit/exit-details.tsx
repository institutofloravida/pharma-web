import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Building2,
  Calendar,
  ClipboardList,
  Layers2,
  Pill,
  RotateCcw,
  User,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { getExitDetails } from '@/api/pharma/movement/exit/get-exit-details'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'
import { getExitTypeTranslation } from '@/lib/utils/translations-mappers/exit-type-translation'

export function ExitDetails() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['exit-details', id],
    queryFn: () => getExitDetails(id ?? '', token ?? ''),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Carregando dados...</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        Saída não encontrada.
      </div>
    )
  }

  const { exitDetails } = data

  const groupedMedicines = Object.values(
    exitDetails.medicines.reduce(
      (acc, med) => {
        if (acc[med.medicineStockId]) {
          acc[med.medicineStockId].batches.push(...med.batches)
        } else {
          acc[med.medicineStockId] = { ...med, batches: [...med.batches] }
        }
        return acc
      },
      {} as Record<string, (typeof exitDetails.medicines)[0]>,
    ),
  )

  return (
    <div className="container mx-auto py-6">
      <Card className="border-none shadow-md">
        <CardHeader className="rounded-t-lg bg-secondary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-secondary-foreground">
                Detalhes da Saída
              </CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Visualização completa dos itens registrados na saída
              </CardDescription>
            </div>
            <Pill className="h-8 w-8 text-secondary-foreground" />
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
              Voltar para Saídas
            </Button>
          </div>

          {/* Informações gerais */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Layers2 className="h-3.5 w-3.5" />
                Estoque
              </span>
              <span className="font-medium">{exitDetails.stock}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Operador
              </span>
              <span className="font-medium">{exitDetails.operator}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Data da Saída
              </span>
              <span className="font-medium">
                {new Date(exitDetails.exitDate).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5" />
                Tipo de Saída
              </span>
              <Badge variant="outline" className="w-fit">
                {getExitTypeTranslation(exitDetails.exitType)}
              </Badge>
            </div>

            {exitDetails.movementType && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Tipo de Movimentação
                </span>
                <span className="font-medium">{exitDetails.movementType}</span>
              </div>
            )}

            {exitDetails.destinationInstitution && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  Instituição Destino
                </span>
                <span className="font-medium">{exitDetails.destinationInstitution}</span>
              </div>
            )}

            {exitDetails.responsibleByInstitution && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Responsável
                </span>
                <span className="font-medium">{exitDetails.responsibleByInstitution}</span>
              </div>
            )}

            {exitDetails.reverseAt && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Revertida em
                </span>
                <Badge variant="destructive" className="w-fit">
                  {new Date(exitDetails.reverseAt).toLocaleDateString('pt-BR')}
                </Badge>
              </div>
            )}
          </div>

          {/* Medicamentos */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Pill className="h-5 w-5" />
              Medicamentos ({groupedMedicines.length})
            </h3>

            {groupedMedicines.map((medicine, index) => (
              <Card key={medicine.medicineStockId} className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    {index + 1}. {medicine.medicineName}
                  </CardTitle>
                  <CardDescription>
                    {medicine.pharmaceuticalForm} • {medicine.dosage} {medicine.unitMeasure}
                    {medicine.complement && ` • ${medicine.complement}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border dark:border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:border-border">
                          <TableHead>Lote</TableHead>
                          <TableHead>Fabricante</TableHead>
                          <TableHead className="text-center">Data Fab.</TableHead>
                          <TableHead className="text-center">Validade</TableHead>
                          <TableHead className="text-right">Qtd.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medicine.batches.map((batch) => (
                          <TableRow key={batch.batchNumber} className="dark:border-border">
                            <TableCell className="font-mono text-sm font-medium">
                              {batch.batchNumber}
                            </TableCell>
                            <TableCell className="text-sm">{batch.manufacturer}</TableCell>
                            <TableCell className="text-center text-sm">
                              {batch.manufacturingDate
                                ? new Date(batch.manufacturingDate).toLocaleDateString('pt-BR')
                                : '-'}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {new Date(batch.expirationDate).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {batch.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
