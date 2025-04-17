import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchPharmaceuticalForms } from '@/api/pharma/auxiliary-records/pharmaceutical-form/fetch-pharmaceutical-form'
import { fetchUnitsMeasure } from '@/api/pharma/auxiliary-records/unit-measure/fetch-units-measure'
import { fetchMedicines } from '@/api/pharma/medicines/fetch-medicines'
import type { FetchMedicinesVariantsResponse } from '@/api/pharma/medicines-variants/fetch-medicines-variants'
import {
  registerMedicineVariant,
  type RegisterMedicineVariantBody,
} from '@/api/pharma/medicines-variants/register-medicine-variant'
import { Combobox } from '@/components/comboboxes/combobox'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { queryClient } from '@/lib/react-query'
import { handleApiError } from '@/lib/utils/handle-api-error'

const FormSchema = z.object({
  medicineId: z.string({
    required_error: 'Selecione um medicamento.',
  }),
  pharmaceuticalFormId: z.string({
    required_error: 'Selecione uma forma farmaceutica.',
  }),
  dosage: z.string({
    required_error: 'Digite uma dosagem.',
  }),
  unitMeasureId: z.string({
    required_error: 'Selecione uma unidade de medida',
  }),
})

export function NewMedicineVariantDialog() {
  const [queryMedicine, setQueryMedicine] = useState('')
  const [queryPharmaceuticalForm, setQueryPharmaceuticalForm] = useState('')
  const [queryUnitMeasure, setQueryUnitMeasure] = useState('')
  const { token } = useAuth()

  const { mutateAsync: registerMedicineVariantFn } = useMutation({
    mutationFn: (data: RegisterMedicineVariantBody) =>
      registerMedicineVariant(data, token ?? ''),
    onSuccess(_, { medicineId, pharmaceuticalFormId, dosage, unitMeasureId }) {
      const cached = queryClient.getQueryData<FetchMedicinesVariantsResponse>([
        'medicines-variants',
        1,
      ]) || { medicines_variants: [], meta: { page: 1, totalCount: 0 } }

      const medicineName = queryMedicine
      const unitMeasureAcronym = queryUnitMeasure
      const pharmaceuticalFormName = queryPharmaceuticalForm

      if (cached.medicines_variants) {
        const updatedData = {
          ...cached,
          medicines_variants: [
            {
              medicineId,
              medicine: medicineName,
              dosage,
              pharmaceuticalFormId,
              unitMeasureId,
              unitMeasure: unitMeasureAcronym,
              pharmaceuticalForm: pharmaceuticalFormName,
            },
            ...cached.medicines_variants,
          ],
          meta: {
            ...cached.meta,
            totalCount: cached.meta.totalCount + 1,
          },
        }

        queryClient.setQueryData(['medicines-variants', 1], updatedData)
      }
    },
  })

  const { data: medicinesResult, isFetching: isFetchingMedicines } = useQuery({
    queryKey: ['medicines', queryMedicine],
    queryFn: () =>
      fetchMedicines({ page: 1, query: queryMedicine }, token ?? ''),
    enabled: queryMedicine !== null,
    staleTime: 1000,
    refetchOnMount: true,
  })

  const {
    data: pharmaceuticalFormResult,
    isFetching: isFetchingPharmaceuticalForm,
  } = useQuery({
    queryKey: ['pharmaceutical-forms', queryPharmaceuticalForm],
    queryFn: () =>
      fetchPharmaceuticalForms(
        { page: 1, query: queryPharmaceuticalForm },
        token ?? '',
      ),
    enabled: queryPharmaceuticalForm !== null,
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data: unitsMeasureResult, isFetching: isFetchingUnitsMeasure } =
    useQuery({
      queryKey: ['units-measure', queryUnitMeasure],
      queryFn: () =>
        fetchUnitsMeasure({ page: 1, query: queryUnitMeasure }, token ?? ''),
      enabled: queryUnitMeasure !== null,
      staleTime: 1000,
      refetchOnMount: true,
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await registerMedicineVariantFn({
        medicineId: data.medicineId,
        pharmaceuticalFormId: data.pharmaceuticalFormId,
        unitMeasureId: data.unitMeasureId,
        dosage: data.dosage,
      })

      toast({
        title: 'Variante cadastrada com sucesso!',
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast({
        title: 'Error ao cadastrar variante!',
        description: errorMessage,
      })
    }
  }

  return (
    <DialogContent className="flex flex-col items-center">
      <DialogHeader className="items-center">
        <DialogTitle>Nova Variante</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar uma nova variante de medicamento.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="medicineId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Medicamento</FormLabel>
                <Combobox
                  items={medicinesResult?.medicines || []}
                  field={field}
                  query={queryMedicine}
                  placeholder="Selecione o medicamento "
                  isFetching={isFetchingMedicines}
                  onQueryChange={setQueryMedicine}
                  onSelect={(id, name) => {
                    form.setValue('medicineId', id)
                    setQueryMedicine(name)
                  }}
                  itemKey="id"
                  itemValue="name"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pharmaceuticalFormId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Forma Farmacêutica</FormLabel>
                <Combobox
                  items={pharmaceuticalFormResult?.pharmaceutical_forms || []}
                  field={field}
                  query={queryPharmaceuticalForm}
                  placeholder="Selecione a forma farmacêutica"
                  isFetching={isFetchingPharmaceuticalForm}
                  onQueryChange={setQueryPharmaceuticalForm}
                  onSelect={(id, name) => {
                    form.setValue('pharmaceuticalFormId', id)
                    setQueryPharmaceuticalForm(name)
                  }}
                  itemKey="id"
                  itemValue="name"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosagem</FormLabel>
                <FormControl>
                  <Input placeholder="Dosagem..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitMeasureId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Combobox
                  items={unitsMeasureResult?.units_measure || []}
                  field={field}
                  query={queryUnitMeasure}
                  placeholder="Selecione a unidade de medida"
                  isFetching={isFetchingUnitsMeasure}
                  onQueryChange={setQueryUnitMeasure}
                  onSelect={(id, acronym) => {
                    form.setValue('unitMeasureId', id)
                    setQueryUnitMeasure(acronym)
                  }}
                  itemKey="id"
                  itemValue="acronym"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  )
}
