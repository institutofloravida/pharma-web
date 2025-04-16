'use client'

import { TrendingUp } from 'lucide-react'
import { Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
const chartData = [
  {
    browser: 'anti-inflammatory',
    visitors: 275,
    fill: 'var(--color-anti-inflammatory)',
  },
  { browser: 'analgesic', visitors: 200, fill: 'var(--color-analgesic)' },
  {
    browser: 'antihypertensives',
    visitors: 187,
    fill: 'var(--color-antihypertensives)',
  },
  {
    browser: 'antidepressants',
    visitors: 173,
    fill: 'var(--color-antidepressants)',
  },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  'anti-inflammatory': {
    label: 'Anti.Inflamatório',
    color: 'hsl(var(--chart-1))',
  },
  analgesic: {
    label: 'Analgésico',
    color: 'hsl(var(--chart-2))',
  },
  antihypertensives: {
    label: 'Anti.Hipertensivos',
    color: 'hsl(var(--chart-3))',
  },
  antidepressants: {
    label: 'Antidepressivos',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Outros',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function MostAttendedTherapeuticsClassesChart() {
  return (
    <Card className="col-span-3 flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Classes Terapêuticas Mais Atendidas</CardTitle>
        <CardDescription>Com base nos medicamentos dispensados</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.visitors}
                  </text>
                )
              }}
              nameKey="browser"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="mt-4 -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
