'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const categories = [
  'Analgésico',
  'Antibiótico',
  'Anti-histamínico',
  'Antiácido',
  'Anti-inflamatório',
  'Antidepressivo',
  'Antiviral',
  'Vitamina',
  'Outro',
]

const suppliers = [
  'Farmacêutica Nacional',
  'MedPharma',
  'Farmacêutica Global',
  'Distribuidora Médica',
  'Outro',
]

export function AddMedicationForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    dosage: '',
    quantity: 0,
    expiryDate: '',
    batchNumber: '',
    supplier: '',
    lowStock: false,
    nearExpiry: false,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        expiryDate: initialData.expiryDate.split('T')[0], // Format date for input
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome do Medicamento</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dosage">Dosagem</Label>
            <Input
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="expiryDate">Data de Validade</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="batchNumber">Número do Lote</Label>
            <Input
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="supplier">Fornecedor</Label>
          <Select
            value={formData.supplier}
            onValueChange={(value) => handleSelectChange('supplier', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um fornecedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">
          {initialData ? 'Atualizar' : 'Adicionar'} Medicamento
        </Button>
      </DialogFooter>
    </form>
  )
}
