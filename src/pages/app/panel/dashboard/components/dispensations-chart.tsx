'use client'

import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { fetchDispensesPerDay } from '@/api/pharma/dashboard/fetch-dispenses-per-day'
import { getDispensesInAPeriodReport } from '@/api/pharma/reports/dispenses-in-a-period-report'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/authContext'
import { queryClient } from '@/lib/react-query'

const chartConfig = {
  total: {
    label: 'Dispensas',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function DispensationsChart() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { institutionId, token } = useAuth()
  const [timeRange, setTimeRange] = React.useState('7d')

  const startDate = searchParams.get('startDate') ?? subDays(new Date(), 7)
  const endDate = searchParams.get('endDate') ?? new Date()

  const { data: dispensesPerDayData, isFetching } = useQuery({
    queryKey: ['dispenses-per-day', institutionId, timeRange],
    queryFn: () =>
      fetchDispensesPerDay(
        {
          institutionId: institutionId ?? '',
          startDate: startDate as Date,
          endDate: endDate as Date,
        },
        token ?? '',
      ),
  })

  function trimesterFilterSelected() {
    const newStartDate = subDays(new Date(), 90)
    const newEndDate = new Date()
    setSearchParams({
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
    })
    setTimeRange('90d')
  }

  function monthFilterSelected() {
    const newStartDate = subDays(new Date(), 30)
    const newEndDate = new Date()
    setSearchParams({
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
    })
    setTimeRange('30d')
  }

  function weekFilterSelected() {
    const newStartDate = subDays(new Date(), 7)
    const newEndDate = new Date()
    setSearchParams({
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
    })
    setTimeRange('7d')
  }

  return (
    <Card className="col-span-6">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Dispensas</CardTitle>
          <CardDescription>
            Veja o total de dispensas realizadas nos últimos{' '}
            {timeRange === '90d'
              ? '3 meses'
              : timeRange === '30d'
                ? '30 dias'
                : '7 dias'}
            .
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => {
            setTimeRange(value)
            if (value === '90d') {
              trimesterFilterSelected()
            }
            if (value === '30d') {
              monthFilterSelected()
            }
            if (value === '7d') {
              weekFilterSelected()
            }
            queryClient.invalidateQueries({
              queryKey: ['dispenses-per-day', institutionId],
            })
          }}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Selecione um valor"
          >
            <SelectValue defaultValue={'7d'} />
          </SelectTrigger>
          <SelectContent defaultChecked className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Útimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Útimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      {isFetching ? (
        <Skeleton className="h-[250px] w-full rounded-xl" />
      ) : (
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={dispensesPerDayData?.dispenses ?? []}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="dispensationDate"
                tickLine={false}
                axisLine={false}
                tickMargin={16}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('pt-BR', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <YAxis
                dataKey="total"
                tickLine={false}
                axisLine={false}
                tickMargin={16}
                minTickGap={32}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('pt-BR', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--color-total)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  )
}
