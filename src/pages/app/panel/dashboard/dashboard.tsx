import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

import { fetchInventoryAlerts } from "@/api/pharma/inventory/fetch-inventory-alerts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";

import { AlertsTab } from "./components/alerts-tab";
import { DispensationsMonthCard } from "./components/dispensation-month-card";
import { DispensationsChart } from "./components/dispensations-chart";
import { DispensationsTodayCard } from "./components/dispensations-today";
import { InventoryTodayCard } from "./components/inventory-today-card";
import { MostTreatedPathologiesChart } from "./components/most-treated-pathologies-chart";
import { MovimentationTable } from "./components/movimentation-table";
import { UsersCard } from "./components/users-card";

export function Dashboard() {
  const { institutionId, token } = useAuth();

  const { data: alerts } = useQuery({
    queryKey: ["inventory-alerts", institutionId],
    queryFn: () =>
      fetchInventoryAlerts({ institutionId: institutionId ?? "" }, token ?? ""),
    enabled: !!institutionId && !!token,
    staleTime: 0,
  });

  const alertCount =
    (alerts?.expiringBatches.length ?? 0) +
    (alerts?.lowStockMedicines.length ?? 0);

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="avisos" className="flex items-center gap-1.5">
              Avisos
              {alertCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {alertCount > 99 ? "99+" : alertCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="flex flex-col gap-4 pt-2">
              <div className="grid grid-cols-4 gap-4">
                <InventoryTodayCard />
                <DispensationsTodayCard />
                <DispensationsMonthCard />
                <UsersCard />
              </div>
              <div className="grid grid-cols-9 gap-4">
                <DispensationsChart />
                <MostTreatedPathologiesChart />
              </div>
              <Tabs defaultValue="movimentacoes">
                <TabsList>
                  <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
                </TabsList>
                <TabsContent value="movimentacoes">
                  <Card className="pt-6">
                    <CardContent className="grid gap-6">
                      <MovimentationTable />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="avisos">
            <Card className="mt-2 pt-6">
              <CardContent>
                {institutionId && (
                  <AlertsTab institutionId={institutionId} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
