import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Box,
  BoxIcon,
  CheckCircle,
  Layers,
  Package,
  XCircle,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { inventoryMedicineDetails } from '@/api/pharma/inventory/inventory-medicine-details'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/authContext'

import { hasLowStock } from './inventory-utils'

interface InventoryMedicineDetailsProps {
  medicineStockId: string
}

export function InventoryMedicineDetails() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: medicine, isLoading } = useQuery({
    queryKey: ['medicine-stock', id],
    queryFn: () =>
      inventoryMedicineDetails({ medicineStockId: id ?? '' }, token ?? ''),
  })
  console.log(medicine)
  return (
    <>
      <div className="container mx-auto py-6">
        <Card className="border-none shadow-md">
          <CardHeader className="rounded-t-lg bg-secondary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-secondary-foreground">
                  Inventário de Medicamentos
                </CardTitle>
                <CardDescription className="text-secondary-foreground/80">
                  Visualize seu estoque de medicamentos
                </CardDescription>
              </div>
              <Package className="h-8 w-8 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/inventory')
                }}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Medicamentos
              </Button>
            </div>

            <div className="mb-4">
              {medicine && (
                <Card className="border-none shadow-sm dark:bg-opacity-10">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {medicine?.medicine}
                        </CardTitle>
                        <CardDescription>
                          {medicine?.pharmaceuticalForm} • {medicine?.dosage}
                          {medicine?.unitMeasure}
                        </CardDescription>
                      </div>
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                        <Box className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Quantity information */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col">
                          <div className="mb-1 flex items-center gap-2">
                            <Box className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                              Total
                            </span>
                          </div>
                          <span className="text-lg font-medium">
                            {medicine?.quantity.totalCurrent}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <div className="mb-1 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-muted-foreground">
                              Disponível
                            </span>
                          </div>
                          <span className="text-lg font-medium text-green-600 dark:text-green-400">
                            {medicine?.quantity.available}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <div className="mb-1 flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-muted-foreground">
                              Indisponível
                            </span>
                          </div>
                          <span className="text-lg font-medium text-red-600 dark:text-red-400">
                            {medicine?.quantity.unavailable}
                          </span>
                        </div>
                      </div>

                      {/* Visual progress bar */}
                      <TooltipProvider>
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${(
                                    (medicine.quantity.available /
                                      medicine.quantity.totalCurrent) *
                                    100
                                  ).toFixed(1)}%`,
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-500 text-white">
                              <p>
                                Disponível: {medicine?.quantity.available} (
                                {(
                                  (medicine?.quantity.available /
                                    medicine?.quantity.totalCurrent) *
                                  100
                                ).toFixed(1)}
                                %)
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="h-full bg-red-500"
                                style={{
                                  width: `${(
                                    (medicine.quantity.unavailable /
                                      medicine.quantity.totalCurrent) *
                                    100
                                  ).toFixed(1)}%`,
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-red-500 text-white">
                              <p>
                                Indisponível: {medicine?.quantity.unavailable} (
                                {(
                                  (medicine.quantity.unavailable /
                                    medicine.quantity.totalCurrent) *
                                  100
                                ).toFixed(1)}
                                %)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>

                      {/* Status badges */}
                      <div className="mt-2 flex gap-2">
                        {medicine.isLowStock && (
                          <Badge variant="destructive">Estoque Baixo</Badge>
                        )}
                        {medicine?.quantity.available === 0 && (
                          <Badge variant="destructive">Estoque Zerado</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="mt-4">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                <Layers className="h-5 w-5" />
                Lotes Disponíveis
              </h3>
              <div className="rounded-md border dark:border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-border">
                      <TableHead>Lote</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-center">Validade</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-center">
                        Data Fabricação
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicine?.batchesStock.map((batch) => {
                      return (
                        <TableRow key={batch.id} className="dark:border-border">
                          <TableCell className="font-medium">
                            {batch.code}
                          </TableCell>

                          <TableCell className="text-center">
                            {batch.quantity}
                          </TableCell>

                          <TableCell className="text-center">
                            <span
                              className={
                                batch.isCloseToExpiration
                                  ? 'font-medium text-amber-600 dark:text-amber-500'
                                  : batch.isExpired
                                    ? 'font-medium text-red-600 dark:text-red-500'
                                    : ''
                              }
                            >
                              {new Date(
                                batch.expirationDate,
                              ).toLocaleDateString('pt-BR')}
                            </span>

                            {batch.isCloseToExpiration && (
                              <Badge
                                variant="warning"
                                className="ml-2 bg-amber-500 text-xs dark:bg-amber-600"
                              >
                                Próximo da Validade
                              </Badge>
                            )}

                            {batch.isExpired && (
                              <Badge
                                variant="destructive"
                                className="ml-2 bg-red-600 text-xs dark:bg-red-700"
                              >
                                Vencido
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell>{batch.manufacturer}</TableCell>

                          <TableCell className="text-center">
                            {batch.manufacturingDate
                              ? new Date(
                                  batch.manufacturingDate,
                                ).toLocaleDateString('pt-BR')
                              : '-'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// export function BatchDetails({ medication, onBack }: BatchDetailsProps) {
//   const categoryColor = getCategoryColor(medication.category)
//   const categoryIcon = getCategoryIcon(medication.category)

//   return (
//     <>
//       <div className="mb-6">
//         <Button
//           variant="outline"
//           onClick={onBack}
//           className="flex items-center gap-1"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Voltar para Medicamentos
//         </Button>
//       </div>

//       <div className="mb-4">
//         <Card className={`${categoryColor} border-none dark:bg-opacity-10`}>
//           <CardHeader className="pb-2">
//             <div className="flex items-start justify-between">
//               <div>
//                 <CardTitle className="text-xl">{medication.name}</CardTitle>
//                 <CardDescription>
//                   {medication.category} • {medication.dosage}
//                 </CardDescription>
//               </div>
//               {categoryIcon}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2">
//                 <Box className="h-5 w-5 text-muted-foreground" />
//                 <span className="text-lg font-medium">
//                   Total: {medication.totalQuantity} unidades
//                 </span>
//               </div>
//               <div className="flex gap-1">
//                 {hasLowStock(medication) && (
//                   <Badge variant="destructive">Estoque Baixo</Badge>
//                 )}
//                 {hasNearExpiryBatch(medication) && (
//                   <Badge
//                     variant="warning"
//                     className="bg-amber-500 dark:bg-amber-600"
//                   >
//                     Lotes Próximos da Validade
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="mt-4">
//         <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
//           <Layers className="h-5 w-5" />
//           Lotes Disponíveis
//         </h3>
//         <div className="rounded-md border dark:border-border">
//           <Table>
//             <TableHeader>
//               <TableRow className="dark:border-border">
//                 <TableHead>Lote</TableHead>
//                 <TableHead className="text-center">Quantidade</TableHead>
//                 <TableHead className="text-center">Validade</TableHead>
//                 <TableHead>Fornecedor</TableHead>
//                 <TableHead className="text-center">Data Fabricação</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {medication.batches.map((batch) => {
//                 const isNearExpiry =
//                   new Date(batch.expiryDate) <=
//                   new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

//                 return (
//                   <TableRow key={batch.id} className="dark:border-border">
//                     <TableCell className="font-medium">
//                       {batch.batchNumber}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       {batch.quantity}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <span
//                         className={
//                           isNearExpiry
//                             ? 'font-medium text-amber-600 dark:text-amber-500'
//                             : ''
//                         }
//                       >
//                         {new Date(batch.expiryDate).toLocaleDateString('pt-BR')}
//                       </span>
//                       {isNearExpiry && (
//                         <Badge
//                           variant="warning"
//                           className="ml-2 bg-amber-500 text-xs dark:bg-amber-600"
//                         >
//                           Próximo da Validade
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>{batch.supplier}</TableCell>
//                     <TableCell className="text-center">
//                       {new Date(batch.manufacturingDate).toLocaleDateString(
//                         'pt-BR',
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 )
//               })}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </>
//   )
// }
