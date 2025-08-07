import { useQuery } from "@tanstack/react-query";
import { Layers, Loader2, Pill } from "lucide-react";

import { GetInventoryMetrics } from "@/api/pharma/dashboard/get-inventory-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";

import { CardSkeleton } from "./card-skeleton";

export function InventoryTodayCard() {
  const { institutionId, token } = useAuth();

  const { data: inventoryMetrics, isLoading } = useQuery({
    queryFn: () =>
      GetInventoryMetrics({ institutionId: institutionId ?? "" }, token ?? ""),
    queryKey: ["metrics", "inventory", institutionId],
    enabled: !!institutionId && !!token,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Inventário</CardTitle>
        {!inventoryMetrics ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Layers className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {inventoryMetrics ? (
          <>
            <span className="text-2xl font-bold">
              {Number(inventoryMetrics?.quantity.totalCurrent)}
            </span>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  Number(inventoryMetrics?.quantity.zero) > 0
                    ? "text-red-500"
                    : "text-red-500"
                }
              >
                {inventoryMetrics?.quantity.zero}
              </span>{" "}
              zerados.
            </p>
            <p className="text-xs text-muted-foreground">
              <span
                className={Number(4) > 0 ? "text-yellow-500" : "text-red-500"}
              >
                0
              </span>{" "}
              próximo(s) da validade.
            </p>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  Number(inventoryMetrics?.quantity.expired) > 0
                    ? "text-orange-500"
                    : "text-red-500"
                }
              >
                {inventoryMetrics?.quantity.expired}
              </span>{" "}
              vencido(s).
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  );
}
