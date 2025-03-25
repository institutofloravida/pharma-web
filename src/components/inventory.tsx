'use client'

import {
  ArrowLeft,
  ArrowUpDown,
  Box,
  Calendar,
  ChevronRight,
  Filter,
  Grid,
  Layers,
  List,
  Package,
  Search,
  Truck,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Sample data for demonstration with batches
const initialMedications = [
  {
    id: 1,
    name: 'Paracetamol',
    category: 'Analgésico',
    dosage: '500mg',
    totalQuantity: 120,
    batches: [
      {
        id: 101,
        batchNumber: 'BT2023001',
        quantity: 50,
        expiryDate: '2025-12-31',
        supplier: 'Farmacêutica Nacional',
        manufacturingDate: '2023-01-15',
        nearExpiry: false,
      },
      {
        id: 102,
        batchNumber: 'BT2023045',
        quantity: 70,
        expiryDate: '2025-08-20',
        supplier: 'Farmacêutica Nacional',
        manufacturingDate: '2023-02-10',
        nearExpiry: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Amoxicilina',
    category: 'Antibiótico',
    dosage: '250mg',
    totalQuantity: 45,
    batches: [
      {
        id: 201,
        batchNumber: 'BT2023089',
        quantity: 45,
        expiryDate: '2025-06-15',
        supplier: 'MedPharma',
        manufacturingDate: '2023-03-22',
        nearExpiry: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Dipirona',
    category: 'Analgésico',
    dosage: '1g',
    totalQuantity: 15,
    batches: [
      {
        id: 301,
        batchNumber: 'BT2022089',
        quantity: 15,
        expiryDate: '2024-08-20',
        supplier: 'Farmacêutica Nacional',
        manufacturingDate: '2022-08-05',
        nearExpiry: true,
      },
    ],
  },
  {
    id: 4,
    name: 'Loratadina',
    category: 'Anti-histamínico',
    dosage: '10mg',
    totalQuantity: 60,
    batches: [
      {
        id: 401,
        batchNumber: 'BT2023112',
        quantity: 30,
        expiryDate: '2026-03-10',
        supplier: 'MedPharma',
        manufacturingDate: '2023-04-18',
        nearExpiry: false,
      },
      {
        id: 402,
        batchNumber: 'BT2023156',
        quantity: 30,
        expiryDate: '2026-05-22',
        supplier: 'MedPharma',
        manufacturingDate: '2023-05-30',
        nearExpiry: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Omeprazol',
    category: 'Antiácido',
    dosage: '20mg',
    totalQuantity: 8,
    batches: [
      {
        id: 501,
        batchNumber: 'BT2022156',
        quantity: 8,
        expiryDate: '2024-05-22',
        supplier: 'Farmacêutica Global',
        manufacturingDate: '2022-05-10',
        nearExpiry: true,
      },
    ],
  },
]

export function Inventory() {
  const [medications, setMedications] = useState(initialMedications)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [showBatches, setShowBatches] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to check if medication has low stock
  const hasLowStock = (medication) => {
    return medication.totalQuantity <= 20
  }

  // Function to check if any batch is near expiry
  const hasNearExpiryBatch = (medication) => {
    return medication.batches.some((batch) => {
      const expiryDate = new Date(batch.expiryDate)
      const today = new Date()
      const ninetyDaysFromNow = new Date()
      ninetyDaysFromNow.setDate(today.getDate() + 90)
      return expiryDate <= ninetyDaysFromNow
    })
  }

  // Function to get background color based on category
  const getCategoryColor = (category) => {
    const colors = {
      Analgésico: '',
      Antibiótico: '',
      'Anti-histamínico': '',
      Antiácido: '',
      'Anti-inflamatório': '',
      Antidepressivo: '',
      Antiviral: '',
      Vitamina: '',
    }
    return colors[category] || ''
  }

  // Function to get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Analgésico':
        return (
          <div className="rounded-ful p-2">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
        )
      case 'Antibiótico':
        return (
          <div className="rounded-ful p-2">
            <Package className="h-5 w-5 text-green-600" />
          </div>
        )
      case 'Anti-histamínico':
        return (
          <div className="rounded-ful p-2">
            <Package className="h-5 w-5 text-purple-600" />
          </div>
        )
      case 'Antiácido':
        return (
          <div className="rounded-full p-2">
            <Package className="h-5 w-5 text-yellow-600" />
          </div>
        )
      default:
        return (
          <div className="rounded-full p-2">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
        )
    }
  }

  const handleMedicationClick = (medication) => {
    setSelectedMedication(medication)
    setShowBatches(true)
  }

  const handleBackToMedications = () => {
    setShowBatches(false)
    setSelectedMedication(null)
  }

  const handleOpenDetailDialog = (medication) => {
    setSelectedMedication(medication)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="border-none shadow-md">
        <CardHeader className="rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Inventário de Medicamentos
              </CardTitle>
              <CardDescription className="text/80">
                {showBatches
                  ? `Lotes de ${selectedMedication?.name} (${selectedMedication?.dosage})`
                  : 'Visualize seu estoque de medicamentos'}
              </CardDescription>
            </div>
            <Package className="h-8 w-8" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {showBatches ? (
            <>
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={handleBackToMedications}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para Medicamentos
                </Button>
              </div>

              <div className="mb-4">
                <Card
                  className={`${getCategoryColor(selectedMedication.category)} border-none`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {selectedMedication.name}
                        </CardTitle>
                        <CardDescription>
                          {selectedMedication.category} •{' '}
                          {selectedMedication.dosage}
                        </CardDescription>
                      </div>
                      {getCategoryIcon(selectedMedication.category)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-medium">
                          Total: {selectedMedication.totalQuantity} unidades
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {hasLowStock(selectedMedication) && (
                          <Badge variant="destructive">Estoque Baixo</Badge>
                        )}
                        {hasNearExpiryBatch(selectedMedication) && (
                          <Badge variant="warning" className="bg-amber-500">
                            Lotes Próximos da Validade
                          </Badge>
                        )}
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lote</TableHead>
                        <TableHead className="text-center">
                          Quantidade
                        </TableHead>
                        <TableHead className="text-center">Validade</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead className="text-center">
                          Data Fabricação
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMedication.batches.map((batch) => {
                        const isNearExpiry =
                          new Date(batch.expiryDate) <=
                          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

                        return (
                          <TableRow key={batch.id}>
                            <TableCell className="font-medium">
                              {batch.batchNumber}
                            </TableCell>
                            <TableCell className="text-center">
                              {batch.quantity}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={
                                  isNearExpiry
                                    ? 'font-medium text-amber-600'
                                    : ''
                                }
                              >
                                {new Date(batch.expiryDate).toLocaleDateString(
                                  'pt-BR',
                                )}
                              </span>
                              {isNearExpiry && (
                                <Badge
                                  variant="warning"
                                  className="ml-2 bg-amber-500 text-xs"
                                >
                                  Próximo da Validade
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{batch.supplier}</TableCell>
                            <TableCell className="text-center">
                              {new Date(
                                batch.manufacturingDate,
                              ).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar medicamentos..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex w-full gap-2 md:w-auto">
                  <div className="flex items-center overflow-hidden rounded-md border">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="mr-1 h-4 w-4" />
                      Lista
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid className="mr-1 h-4 w-4" />
                      Grade
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSearchTerm('Analgésico')}
                      >
                        Analgésicos
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSearchTerm('Antibiótico')}
                      >
                        Antibióticos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchTerm('')}>
                        Limpar filtros
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {viewMode === 'list' ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">
                          <div className="flex items-center gap-1">
                            Nome
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Dosagem</TableHead>
                        <TableHead className="text-center">
                          Quantidade Total
                        </TableHead>
                        <TableHead className="text-center">Lotes</TableHead>
                        <TableHead className="text-center">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMedications.length > 0 ? (
                        filteredMedications.map((medication) => (
                          <TableRow
                            key={medication.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleMedicationClick(medication)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                {medication.name}
                                <div className="mt-1 flex gap-1">
                                  {hasLowStock(medication) && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Estoque Baixo
                                    </Badge>
                                  )}
                                  {hasNearExpiryBatch(medication) && (
                                    <Badge
                                      variant="warning"
                                      className="bg-amber-500 text-xs"
                                    >
                                      Próximo da Validade
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{medication.category}</TableCell>
                            <TableCell>{medication.dosage}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`font-medium ${hasLowStock(medication) ? 'text-destructive' : ''}`}
                              >
                                {medication.totalQuantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {medication.batches.length}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMedicationClick(medication)
                                }}
                              >
                                Ver Lotes
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-6 text-center text-muted-foreground"
                          >
                            Nenhum medicamento encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMedications.length > 0 ? (
                    filteredMedications.map((medication) => (
                      <Card
                        key={medication.id}
                        className={`overflow-hidden transition-all duration-200 hover:shadow-md ${getCategoryColor(medication.category)} cursor-pointer`}
                        onClick={() => handleMedicationClick(medication)}
                      >
                        <CardHeader className="flex flex-row items-start justify-between px-4 pb-2 pt-4">
                          <div>
                            <CardTitle className="text-lg font-bold">
                              {medication.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {medication.category} • {medication.dosage}
                            </CardDescription>
                          </div>
                          {getCategoryIcon(medication.category)}
                        </CardHeader>
                        <CardContent className="px-4 pb-2">
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Box className="h-4 w-4 text-muted-foreground" />
                              <span
                                className={`font-medium ${hasLowStock(medication) ? 'text-destructive' : ''}`}
                              >
                                {medication.totalQuantity} unidades
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Layers className="h-4 w-4 text-muted-foreground" />
                              <span>{medication.batches.length} lotes</span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {hasLowStock(medication) && (
                              <Badge variant="destructive" className="text-xs">
                                Estoque Baixo
                              </Badge>
                            )}
                            {hasNearExpiryBatch(medication) && (
                              <Badge
                                variant="warning"
                                className="bg-amber-500 text-xs"
                              >
                                Próximo da Validade
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMedicationClick(medication)
                            }}
                          >
                            Ver Lotes
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                      Nenhum medicamento encontrado.
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <Dialog
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Detalhes do Medicamento</DialogTitle>
              </DialogHeader>
              {selectedMedication && (
                <ScrollArea className="max-h-[70vh]">
                  <div className="p-4">
                    <Card
                      className={`${getCategoryColor(selectedMedication.category)} mb-4 border-none`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">
                              {selectedMedication.name}
                            </CardTitle>
                            <CardDescription>
                              {selectedMedication.category} •{' '}
                              {selectedMedication.dosage}
                            </CardDescription>
                          </div>
                          {getCategoryIcon(selectedMedication.category)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Box className="h-5 w-5 text-muted-foreground" />
                            <span className="text-lg font-medium">
                              Total: {selectedMedication.totalQuantity} unidades
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="mb-3 text-lg font-medium">
                      Lotes Disponíveis
                    </h3>
                    {selectedMedication.batches.map((batch) => {
                      const isNearExpiry =
                        new Date(batch.expiryDate) <=
                        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

                      return (
                        <Card key={batch.id} className="mb-3">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              Lote: {batch.batchNumber}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="grid grid-cols-2 gap-y-2">
                              <div className="flex items-center gap-2">
                                <Box className="h-4 w-4 text-muted-foreground" />
                                <span>Quantidade: {batch.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span
                                  className={
                                    isNearExpiry
                                      ? 'font-medium text-amber-600'
                                      : ''
                                  }
                                >
                                  Validade:{' '}
                                  {new Date(
                                    batch.expiryDate,
                                  ).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <span>Fornecedor: {batch.supplier}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  Fabricação:{' '}
                                  {new Date(
                                    batch.manufacturingDate,
                                  ).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                            {isNearExpiry && (
                              <div className="mt-2">
                                <Badge
                                  variant="warning"
                                  className="bg-amber-500"
                                >
                                  Próximo da Validade
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>

          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {showBatches
                ? `Total de lotes: ${selectedMedication?.batches.length}`
                : `Total de medicamentos: ${filteredMedications.length}`}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-destructive"></span>
                <span>Estoque Baixo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-500"></span>
                <span>Próximo da Validade</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
