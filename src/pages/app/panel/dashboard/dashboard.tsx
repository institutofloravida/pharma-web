import { Helmet } from "react-helmet-async";

import { DispensationsMonthCard } from "./components/dispensation-month-card";
import { DispensationsChart } from "./components/dispensations-chart";
import { DispensationsTodayCard } from "./components/dispensations-today";
import { InventoryTodayCard } from "./components/inventory-today-card";
import { MostTreatedPathologiesChart } from "./components/most-treated-pathologies-chart";
import { UsersCard } from "./components/users-card";
import { MovimentationTable } from "./components/movimentation-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          <InventoryTodayCard />
          <DispensationsTodayCard />
          <DispensationsMonthCard />
          <UsersCard />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <DispensationsChart />
          <MostTreatedPathologiesChart />
          {/* <ReceiptChart /> */}
          {/* <PopularProductsChart /> */}
        </div>
        <div className="flex w-full flex-col gap-6">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Movimentações</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card className="pt-6">
                <CardContent className="grid gap-6">
                  <MovimentationTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
