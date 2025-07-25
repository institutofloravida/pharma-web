'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { MedicineVariant } from '@/api/pharma/medicines-variants/fetch-medicines-variants'
import { fetchMedicinesVariants } from '@/api/pharma/medicines-variants/fetch-medicines-variants'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/contexts/authContext'

interface MedicationSearchProps {
  onSelect: (medication: MedicineVariant) => void
  selectedMedications: string[]
}

export function MedicationSearch({
  onSelect,
  selectedMedications,
}: MedicationSearchProps) {
  const [query, setQuery] = useState('')
  const { token } = useAuth()

  const { data, isFetching } = useQuery({
    queryKey: ['medicines-variants', query],
    queryFn: () => fetchMedicinesVariants({ page: 1, query }, token ?? ''),
    staleTime: 0,
    refetchOnMount: true,
  })

  const availableMedications = data?.medicines_variants.filter(
    (med) => !selectedMedications.includes(med.id),
  )

  const [selectedId, setSelectedId] = useState<string>('')

  return (
    <FormItem className="col-span-6 flex flex-col gap-1">
      <FormLabel>Medicamento</FormLabel>
      <ComboboxUp
        items={availableMedications ?? []}
        field={{
          value: selectedId,
          onChange: (id: string) => {
            setSelectedId(id)
            const med = availableMedications?.find((m) => m.id === id)
            if (med) {
              onSelect(med)
              setSelectedId('') // limpa após selecionar, se quiser
            }
          },
        }}
        query={query}
        placeholder="Pesquisar medicamento..."
        isFetching={isFetching}
        onQueryChange={setQuery}
        onSelect={(_, item) => {
          // não precisa usar aqui, já está no onChange acima
        }}
        itemKey="id"
        getItemText={(item) =>
          `${item.medicine} ${item.dosage}${item.unitMeasure} | ${item.pharmaceuticalForm}`
        }
        formatItem={(item) =>
          `${item.medicine} ${item.dosage}${item.unitMeasure} | ${item.pharmaceuticalForm}`
        }
      />
      <FormMessage />
    </FormItem>
  )
}
