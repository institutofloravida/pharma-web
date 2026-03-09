import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Layers2,
  Pill,
  RotateCcw,
  User,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { getDispensationDetails } from '@/api/pharma/dispensation/get-dispensation-details'
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

export function DispensationDetails() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['dispensation-details', id],
    queryFn: () => getDispensationDetails(id ?? '', token ?? ''),
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
        Dispensa não encontrada.
      </div>
    )
  }

  const { dispensationDetails } = data

  return (
    <div className="container mx-auto py-6">
      <Card className="border-none shadow-md">
        <CardHeader className="rounded-t-lg bg-secondary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-secondary-foreground">
                Detalhes da Dispensa
              </CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                Visualização completa dos medicamentos dispensados
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
              Voltar para Dispensas
            </Button>
          </div>

          {/* Informações gerais */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Usuário
              </span>
              <span className="font-medium">{dispensationDetails.patient}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Operador
              </span>
              <span className="font-medium">{dispensationDetails.operator}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Data da Dispensa
              </span>
              <span className="font-medium">
                {new Date(dispensationDetails.dispensationDate).toLocaleDateString('pt-BR')}
              </span>
            </div>

            {dispensationDetails.stock && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Layers2 className="h-3.5 w-3.5" />
                  Estoque
                </span>
                <span className="font-medium">{dispensationDetails.stock}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5" />
                Itens
              </span>
              <span className="font-medium">{dispensationDetails.items}</span>
            </div>

            {dispensationDetails.reverseAt && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Revertida em
                </span>
                <Badge variant="destructive" className="w-fit">
                  {new Date(dispensationDetails.reverseAt).toLocaleDateString('pt-BR')}
                </Badge>
              </div>
            )}
          </div>

          {/* Medicamentos */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Pill className="h-5 w-5" />
              Medicamentos ({dispensationDetails.medicines.length})
            </h3>

            <div className="rounded-md border dark:border-border">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-border">
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Forma Farm.</TableHead>
                    <TableHead>Dosagem</TableHead>
                    <TableHead>Complemento</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispensationDetails.medicines.map((medicine) => (
                    <TableRow key={medicine.medicineStockId} className="dark:border-border">
                      <TableCell className="font-medium">{medicine.medicine}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {medicine.pharmaceuticalForm}
                      </TableCell>
                      <TableCell className="text-sm">
                        {medicine.dosage}{medicine.unitMeasure}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {medicine.complement ?? '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {medicine.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
