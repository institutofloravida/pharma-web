import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarClock, Loader2, PackageX } from "lucide-react";

import { fetchInventoryAlerts } from "@/api/pharma/inventory/fetch-inventory-alerts";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/authContext";
import { AlertsSettingsDialog } from "./alerts-settings-dialog";

interface AlertsTabProps {
  institutionId: string;
}

export function AlertsTab({ institutionId }: AlertsTabProps) {
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-alerts", institutionId],
    queryFn: () => fetchInventoryAlerts({ institutionId }, token ?? ""),
    enabled: !!institutionId && !!token,
    staleTime: 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Avisos
        </h2>
        <AlertsSettingsDialog institutionId={institutionId} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {data && (
        <>
          {/* Vencimento Próximo */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-medium">
              <CalendarClock className="h-4 w-4 text-amber-500" />
              Vencimento Próximo
              {data.expiringBatches.length > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white">
                  {data.expiringBatches.length}
                </Badge>
              )}
            </h3>
            {data.expiringBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum lote próximo do vencimento.
              </p>
            ) : (
              <div className="space-y-2">
                {data.expiringBatches.map((item, idx) => (
                  <div
                    key={`${item.medicineStockId}-${item.batchCode}-${idx}`}
                    className="flex items-start justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.medicine}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.pharmaceuticalForm} · {item.dosage}
                        {item.unitMeasure}
                        {item.complement ? ` · ${item.complement}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Estoque: {item.stock} · Lote: {item.batchCode}
                      </p>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {new Date(item.expirationDate).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} un.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Estoque Abaixo do Mínimo */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-base font-medium">
              <PackageX className="h-4 w-4 text-destructive" />
              Estoque Abaixo do Mínimo
              {data.lowStockMedicines.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {data.lowStockMedicines.length}
                </Badge>
              )}
            </h3>
            {data.lowStockMedicines.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum medicamento abaixo do nível mínimo.
              </p>
            ) : (
              <div className="space-y-2">
                {data.lowStockMedicines.map((item) => (
                  <div
                    key={item.medicineStockId}
                    className="flex items-start justify-between rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.medicine}</p>
                      <p className="text-xs text-muted-foreground">
                        Estoque: {item.stock}
                      </p>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-sm font-medium text-destructive">
                        {item.currentQuantity}
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / mín. {item.minimumLevel}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
