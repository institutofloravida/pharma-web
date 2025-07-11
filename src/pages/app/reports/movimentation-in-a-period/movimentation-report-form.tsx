import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ExitType } from '@/api/pharma/movement/exit/register-medicine-exit'
import { fetchOperators } from '@/api/pharma/operators/fetch-operators'
import { getMovimentationInAPeriodReport } from '@/api/pharma/reports/movimentation-in-a-period-report'
import { fetchUsers } from '@/api/pharma/users/fetch-users'
import { ComboboxUp } from '@/components/comboboxes/combobox-up'
import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/contexts/authContext'
import { Formatter } from '@/lib/utils/formaters/formaters'
import { dateFormatter } from '@/lib/utils/formatter'
import { getOperatorRoleTranslation } from '@/lib/utils/translations-mappers/operator-role-translation'

import { useMovimentationReportPdf } from './use-movimentation-report'

export const movimentationReportFormSchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().optional(),
  medicineVariantId: z.string().optional(),
  medicineVariantName: z.string().optional(),
  stockId: z.string().optional(),
  stockName: z.string().optional(),
  medicineStockId: z.string().optional(),
  medicineStockName: z.string().optional(),
  batchStockId: z.string().optional(),
  batchStockName: z.string().optional(),
  movementTypeId: z.string().optional(),
  movementTypeName: z.string().optional(),
  exitType: z.nativeEnum(ExitType).optional(),
  quantity: z.number().optional(),
  operatorId: z.string().optional(),
  operatorName: z.string().optional(),
  startDate: z.date({
    required_error: 'A data início é obrigatória.',
  }),
  endDate: z.date({
    required_error: 'A data fim é obrigatória.',
  }),
})
type MovimentationReportFormSchema = z.infer<
  typeof movimentationReportFormSchema
>

export function MovimentationReportForm() {
  const [queryUsers, setQueryUsers] = useState('')
  const [filters, setFilters] = useState<MovimentationReportFormSchema | null>({
    startDate: new Date(),
    endDate: new Date(),
  })

  const { token, institutionId } = useAuth()
  const generatePdf = useMovimentationReportPdf()

  const form = useForm<MovimentationReportFormSchema>({
    resolver: zodResolver(movimentationReportFormSchema),
  })

  const { data: operatorsResult, isFetching: isFetchingOperators } = useQuery({
    queryKey: ['operators'],
    queryFn: () => fetchOperators({ page: 1 }, token ?? ''),
    staleTime: 1000,
    refetchOnMount: true,
  })

  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      'movimentation-report',
      institutionId,
      filters?.operatorId ?? null,
      filters?.operatorName ?? null,
      filters?.startDate ?? null,
      filters?.endDate ?? null,
    ],
    queryFn: ({ queryKey }) => {
      const [, institutionIdRaw, operatorId, operatorName, startDate, endDate] =
        queryKey
      const institutionId =
        typeof institutionIdRaw === 'string' ? institutionIdRaw : ''
      return getMovimentationInAPeriodReport(
        {
          institutionId,
          operatorId: operatorId as string | undefined,
          startDate: (startDate as Date) ?? new Date(),
          endDate: (endDate as Date) ?? new Date(),
        },
        token ?? '',
      )
    },
    enabled: false,
  })
  const handleClick = async () => {
    const isValid = await form.trigger()
    if (!isValid) return
    console.log('ge values: ', form.getValues())
    setFilters(form.getValues())

    setTimeout(async () => {
      const result = await refetch()
      console.log('filtros: ', filters)
      console.log(result.data)
      if (result.data?.movimentation && filters) {
        generatePdf(result.data.movimentation, {
          startDate: filters.startDate ?? new Date(),
          endDate: filters.endDate ?? new Date(),
          operator: filters.operatorName,
          institutionId: institutionId ?? '',
        })
      }
    }, 0)
  }
  const handleClearFilters = () => {
    form.reset()
    setFilters(null)
  }

  return (
    <Form {...form}>
      <form className="flex grid grid-cols-6 items-center gap-2">
        <div className="col-span-6 flex gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Fim</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="operatorId"
          render={({ field }) => (
            <FormItem className="col-span-3 flex flex-col gap-1">
              <FormLabel>Operador</FormLabel>
              <ComboboxUp
                field={field}
                items={operatorsResult?.operators ?? []}
                itemKey="id"
                onQueryChange={setQueryUsers}
                query={queryUsers}
                isFetching={isFetchingOperators}
                formatItem={(item) =>
                  `${item.name ?? ''} - ${getOperatorRoleTranslation(item.role) ?? ''} - ${item.email ?? ''}`
                }
                getItemText={(item) =>
                  `${item.name ?? ''} - ${getOperatorRoleTranslation(item.role) ?? ''} - ${item.email ?? ''}`
                }
                placeholder="Pesquise por um Operador"
                onSelect={(id, item) => {
                  form.setValue('operatorId', id)
                  form.setValue('operatorName', item.name)
                }}
              />
              <FormDescription>
                Pesquise por cpf, nome ou data de nascimento{' '}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={handleClearFilters}
            type="button"
            variant={'outline'}
            size={'xs'}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar Campos
          </Button>
          <Button onClick={handleClick} disabled={isFetching} type="button">
            {isFetching ? 'Gerando relatório...' : 'Gerar PDF'}{' '}
          </Button>
        </div>
      </form>
    </Form>
  )
}
