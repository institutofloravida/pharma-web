"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import { fetchMostTreatedPathologies } from "@/api/pharma/dashboard/fetch-most-treated-pathologies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/authContext";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-foreground">{data.pathologyName}</p>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: data.fill }}
            />
            <span className="text-sm text-muted-foreground">
              {data.total} atendimentos ({data.percentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function MostTreatedPathologiesChart() {
  const { institutionId, token } = useAuth();
  const REFRESH_INTERVAL_MS = 30_000;

  const { data: mostTreatedPathologiesData, isFetching } = useQuery({
    queryKey: ["most-treated-pathologies", institutionId],
    queryFn: () =>
      fetchMostTreatedPathologies(
        {
          institutionId: institutionId ?? "",
        },
        token ?? "",
      ),
    enabled: !!token && !!institutionId,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const { chartConfig, chartData } = useMemo(() => {
    if (!mostTreatedPathologiesData?.mostTreatedPathologies) {
      return { chartConfig: {}, chartData: [] };
    }

    const data = mostTreatedPathologiesData.mostTreatedPathologies.map(
      (item, idx) => ({
        ...item,
        fill:
          item.pathologyId === "others"
            ? COLORS[4]
            : COLORS[idx % COLORS.length],
      }),
    );

    const config = data.reduce(
      (acc, item, idx) => {
        const color =
          item.pathologyId === "others"
            ? COLORS[4]
            : COLORS[idx % COLORS.length];

        acc[item.pathologyName] = {
          label: item.pathologyName,
          color,
        };

        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    );

    return { chartConfig: config, chartData: data };
  }, [mostTreatedPathologiesData]);

  return (
    <Card className="col-span-3 flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Patologias mais atendidas</CardTitle>
        <CardDescription>Com base nas dispensas realizadas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square px-0"
          config={chartConfig}
        >
          {isFetching ? (
            <Skeleton className="h-[250px] w-full rounded-xl" />
          ) : (
            <PieChart>
              <ChartTooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="total"
                labelLine={false}
                label={({ payload, ...props }) => (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.percentage.toFixed(1)}%
                  </text>
                )}
                nameKey="pathologyName"
                isAnimationActive={false}
                outerRadius="80%"
                innerRadius="60%"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.pathologyId}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="pathologyName" />}
                className="mt-4 -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
              />
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
