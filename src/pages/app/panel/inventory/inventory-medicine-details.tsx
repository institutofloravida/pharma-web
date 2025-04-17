import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Box, BoxIcon, Layers, Package } from 'lucide-react'
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
              <Card className={`dark:bg-opacity-10`}>
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
                    <BoxIcon />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Box className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">
                        Total: {medicine?.totalQuantity} unidades
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {medicine?.isLowStock && (
                        <Badge variant="destructive">Estoque Baixo</Badge>
                      )}
                      {/* {hasNearExpiryBatch(medicine) && (
                  <Badge
                    variant="warning"
                    className="bg-amber-500 dark:bg-amber-600"
                  >
                    Lotes Próximos da Validade
                  </Badge>
                )} */}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      const isNearExpiry =
                        new Date(batch.expirationDate) <=
                        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

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
                                isNearExpiry
                                  ? 'font-medium text-amber-600 dark:text-amber-500'
                                  : ''
                              }
                            >
                              {new Date(
                                batch.expirationDate,
                              ).toLocaleDateString('pt-BR')}
                            </span>
                            {isNearExpiry && (
                              <Badge
                                variant="warning"
                                className="ml-2 bg-amber-500 text-xs dark:bg-amber-600"
                              >
                                Próximo da Validade
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
