// 'use client'

// import * as React from 'react'
// import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// const chartData = [
//   { date: '2024-04-01', mobile: 150 },
//   { date: '2024-04-02', mobile: 180 },
//   { date: '2024-04-03', mobile: 120 },
//   { date: '2024-04-04', mobile: 260 },
//   { date: '2024-04-05', mobile: 290 },
//   { date: '2024-04-06', mobile: 340 },
//   { date: '2024-04-07', mobile: 180 },
//   { date: '2024-04-08', mobile: 320 },
//   { date: '2024-04-09', mobile: 110 },
//   { date: '2024-04-10', mobile: 190 },
//   { date: '2024-04-11', mobile: 350 },
//   { date: '2024-04-12', mobile: 210 },
//   { date: '2024-04-13', mobile: 380 },
//   { date: '2024-04-14', mobile: 220 },
//   { date: '2024-04-15', mobile: 170 },
//   { date: '2024-04-16', mobile: 190 },
//   { date: '2024-04-17', mobile: 360 },
//   { date: '2024-04-18', mobile: 410 },
//   { date: '2024-04-19', mobile: 180 },
//   { date: '2024-04-20', mobile: 150 },
//   { date: '2024-04-21', mobile: 200 },
//   { date: '2024-04-22', mobile: 170 },
//   { date: '2024-04-23', mobile: 230 },
//   { date: '2024-04-24', mobile: 290 },
//   { date: '2024-04-25', mobile: 250 },
//   { date: '2024-04-26', mobile: 130 },
//   { date: '2024-04-27', mobile: 420 },
//   { date: '2024-04-28', mobile: 180 },
//   { date: '2024-04-29', mobile: 240 },
//   { date: '2024-04-30', mobile: 380 },
//   { date: '2024-05-01', mobile: 220 },
//   { date: '2024-05-02', mobile: 310 },
//   { date: '2024-05-03', mobile: 190 },
//   { date: '2024-05-04', mobile: 420 },
//   { date: '2024-05-05', mobile: 390 },
//   { date: '2024-05-06', mobile: 520 },
//   { date: '2024-05-07', mobile: 300 },
//   { date: '2024-05-08', mobile: 210 },
//   { date: '2024-05-09', mobile: 180 },
//   { date: '2024-05-10', mobile: 330 },
//   { date: '2024-05-11', mobile: 270 },
//   { date: '2024-05-12', mobile: 240 },
//   { date: '2024-05-13', mobile: 160 },
//   { date: '2024-05-14', mobile: 490 },
//   { date: '2024-05-15', mobile: 380 },
//   { date: '2024-05-16', mobile: 400 },
//   { date: '2024-05-17', mobile: 420 },
//   { date: '2024-05-18', mobile: 350 },
//   { date: '2024-05-19', mobile: 180 },
//   { date: '2024-05-20', mobile: 230 },
//   { date: '2024-05-21', mobile: 140 },
//   { date: '2024-05-22', mobile: 120 },
//   { date: '2024-05-23', mobile: 290 },
//   { date: '2024-05-24', mobile: 220 },
//   { date: '2024-05-25', mobile: 250 },
//   { date: '2024-05-26', mobile: 170 },
//   { date: '2024-05-27', mobile: 460 },
//   { date: '2024-05-28', mobile: 190 },
//   { date: '2024-05-29', mobile: 130 },
//   { date: '2024-05-30', mobile: 280 },
//   { date: '2024-05-31', mobile: 230 },
//   { date: '2024-06-01', mobile: 200 },
//   { date: '2024-06-02', mobile: 410 },
//   { date: '2024-06-03', mobile: 160 },
//   { date: '2024-06-04', mobile: 380 },
//   { date: '2024-06-05', mobile: 140 },
//   { date: '2024-06-06', mobile: 250 },
//   { date: '2024-06-07', mobile: 370 },
//   { date: '2024-06-08', mobile: 320 },
//   { date: '2024-06-09', mobile: 480 },
//   { date: '2024-06-10', mobile: 200 },
//   { date: '2024-06-11', mobile: 150 },
//   { date: '2024-06-12', mobile: 420 },
//   { date: '2024-06-13', mobile: 130 },
//   { date: '2024-06-14', mobile: 380 },
//   { date: '2024-06-15', mobile: 350 },
//   { date: '2024-06-16', mobile: 310 },
//   { date: '2024-06-17', mobile: 520 },
//   { date: '2024-06-18', mobile: 170 },
//   { date: '2024-06-19', mobile: 290 },
//   { date: '2024-06-20', mobile: 450 },
//   { date: '2024-06-21', mobile: 210 },
//   { date: '2024-06-22', mobile: 270 },
//   { date: '2024-06-23', mobile: 530 },
//   { date: '2024-06-24', mobile: 180 },
//   { date: '2024-06-25', mobile: 190 },
//   { date: '2024-06-26', mobile: 380 },
//   { date: '2024-06-27', mobile: 490 },
//   { date: '2024-06-28', mobile: 200 },
//   { date: '2024-06-29', mobile: 160 },
//   { date: '2024-06-30', mobile: 400 },
// ]

// const chartConfig = {
//   mobile: {
//     label: 'Dispensas',
//     color: 'hsl(var(--chart-2))',
//   },
// } satisfies ChartConfig

// export function DispensationsChart() {
//   const [timeRange, setTimeRange] = React.useState('7d')

//   const filteredData = chartData.filter((item) => {
//     const date = new Date(item.date)
//     const referenceDate = new Date('2024-06-30')
//     let daysToSubtract = 90
//     if (timeRange === '30d') {
//       daysToSubtract = 30
//     } else if (timeRange === '7d') {
//       daysToSubtract = 7
//     }
//     const startDate = new Date(referenceDate)
//     startDate.setDate(startDate.getDate() - daysToSubtract)
//     return date >= startDate
//   })

//   return (
//     <Card className="col-span-6">
//       <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
//         <div className="grid flex-1 gap-1 text-center sm:text-left">
//           <CardTitle>Dispensas</CardTitle>
//           <CardDescription>
//             Veja o total de medicamentos dispensados nos últimos 3 meses.
//           </CardDescription>
//         </div>
//         <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger
//             className="w-[160px] rounded-lg sm:ml-auto"
//             aria-label="Selecione um valor"
//           >
//             <SelectValue defaultValue={'7d'} />
//           </SelectTrigger>
//           <SelectContent defaultChecked className="rounded-xl">
//             <SelectItem value="90d" className="rounded-lg">
//               Útimos 3 meses
//             </SelectItem>
//             <SelectItem value="30d" className="rounded-lg">
//               Útimos 30 dias
//             </SelectItem>
//             <SelectItem value="7d" className="rounded-lg">
//               Últimos 7 dias
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <AreaChart data={filteredData}>
//             <defs>
//               {/* <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient> */}
//               <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value)
//                 return date.toLocaleDateString('pt-BR', {
//                   month: 'short',
//                   day: 'numeric',
//                 })
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(value) => {
//                     return new Date(value).toLocaleDateString('pt-BR', {
//                       month: 'short',
//                       day: 'numeric',
//                     })
//                   }}
//                   indicator="dot"
//                 />
//               }
//             />
//             <Area
//               dataKey="mobile"
//               type="natural"
//               fill="url(#fillMobile)"
//               stroke="var(--color-mobile)"
//               stackId="a"
//             />
//             <ChartLegend content={<ChartLegendContent />} />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }

'use client'

import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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
            Veja o total de medicamentos dispensados nos últimos 3 meses.
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
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
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
    </Card>
  )
}
