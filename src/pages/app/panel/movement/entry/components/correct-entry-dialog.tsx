import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  correctMedicineEntry,
} from '@/api/pharma/movement/entry/correct-medicine-entry'
import type { EntryDetails } from '@/api/pharma/movement/entry/get-entry-details'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'
import { handleApiError } from '@/lib/utils/handle-api-error'
import { useState } from 'react'

const correctionSchema = z.object({
  items: z.array(
    z.object({
      movimentationId: z.string(),
      medicineName: z.string(),
      batchNumber: z.string(),
      originalQuantity: z.number(),
      newQuantity: z.coerce.number().int().min(1, 'Mínimo 1'),
    }),
  ),
})

type CorrectionFormData = z.infer<typeof correctionSchema>

interface CorrectEntryDialogProps {
  entryDetails: EntryDetails
}

export function CorrectEntryDialog({ entryDetails }: CorrectEntryDialogProps) {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const flatItems = entryDetails.medicines.flatMap((med) =>
    med.batches.map((batch) => ({
      movimentationId: batch.movimentationId,
      medicineName: med.medicineName,
      batchNumber: batch.batchNumber,
      originalQuantity: batch.quantity,
      newQuantity: batch.quantity,
    })),
  )

  const form = useForm<CorrectionFormData>({
    resolver: zodResolver(correctionSchema),
    defaultValues: { items: flatItems },
  })

  const { fields } = useFieldArray({ control: form.control, name: 'items' })

  // Resetar o form com os valores atuais toda vez que o dialog abrir
  useEffect(() => {
    if (open) {
      form.reset({ items: flatItems })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const { mutateAsync: correctEntry, isPending } = useMutation({
    mutationFn: (data: CorrectionFormData) => {
      const corrections = data.items
        .filter((item) => item.newQuantity !== item.originalQuantity)
        .map((item) => ({
          movimentationId: item.movimentationId,
          newQuantity: item.newQuantity,
        }))

      return correctMedicineEntry(
        { entryId: entryDetails.id, corrections },
        token ?? '',
      )
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['entry-details', entryDetails.id] })
      toast.success('Entrada corrigida com sucesso!')
      setOpen(false)
    },
    onError(error) {
      toast.error('Erro ao corrigir entrada', {
        description: handleApiError(error),
      })
    },
  })

  function handleSubmit(data: CorrectionFormData) {
    const changed = data.items.filter(
      (item) => item.newQuantity !== item.originalQuantity,
    )
    if (changed.length === 0) {
      toast.warning('Nenhuma quantidade foi alterada.')
      return
    }
    correctEntry(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Corrigir Entrada
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Corrigir Entrada</DialogTitle>
          <DialogDescription>
            Altere apenas as quantidades incorretas. Os demais itens serão
            mantidos. Esta ação é irreversível.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="rounded-md border dark:border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead className="text-center">Qtd. Original</TableHead>
                    <TableHead className="text-center">Qtd. Correta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="text-sm font-medium">
                        {field.medicineName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {field.batchNumber}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {field.originalQuantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <FormField
                          control={form.control}
                          name={`items.${index}.newQuantity`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...formField}
                                  type="number"
                                  min={1}
                                  className="mx-auto h-8 w-24 text-center"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Correção'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
