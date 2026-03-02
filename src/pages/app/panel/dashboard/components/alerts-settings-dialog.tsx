import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { fetchStocks } from "@/api/pharma/auxiliary-records/stock/fetch-stocks";
import { getStockSettings } from "@/api/pharma/auxiliary-records/stock/get-stock-settings";
import { updateStockSettings } from "@/api/pharma/auxiliary-records/stock/update-stock-settings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/authContext";

interface StockSettingRowProps {
  stockId: string;
  stockName: string;
  institutionId: string;
  onSaved: () => void;
}

function StockSettingRow({
  stockId,
  stockName,
  institutionId,
  onSaved,
}: StockSettingRowProps) {
  const { token } = useAuth();

  const { data: settings } = useQuery({
    queryKey: ["stock-settings", stockId],
    queryFn: () => getStockSettings({ stockId }, token ?? ""),
    enabled: !!token,
  });

  const [days, setDays] = useState<number | "">(
    settings?.expirationWarningDays ?? 30,
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (expirationWarningDays: number) =>
      updateStockSettings({ stockId, expirationWarningDays }, token ?? ""),
    onSuccess: () => {
      onSaved();
      toast.success(`Configuração de "${stockName}" salva`);
    },
    onError: () => {
      toast.error("Erro ao salvar configuração");
    },
  });

  const displayDays =
    days === "" ? settings?.expirationWarningDays ?? 30 : days;

  return (
    <div className="flex items-center gap-3">
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {stockName}
      </span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          className="h-8 w-20 text-center"
          value={days}
          onChange={(e) =>
            setDays(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <span className="text-xs text-muted-foreground">dias</span>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          disabled={isPending || days === "" || days < 1}
          onClick={() => mutateAsync(displayDays)}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}

interface AlertsSettingsDialogProps {
  institutionId: string;
}

export function AlertsSettingsDialog({
  institutionId,
}: AlertsSettingsDialogProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: stocksData, isLoading: isLoadingStocks } = useQuery({
    queryKey: ["stocks", institutionId],
    queryFn: () =>
      fetchStocks({ institutionsIds: [institutionId] }, token ?? ""),
    enabled: !!token && !!institutionId && open,
  });

  function handleSaved() {
    queryClient.invalidateQueries({
      queryKey: ["inventory-alerts", institutionId],
    });
    queryClient.invalidateQueries({
      queryKey: ["metrics", "inventory", institutionId],
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações de Alertas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Label className="text-xs text-muted-foreground">
            Dias de aviso antes do vencimento por estoque:
          </Label>
          <div className="space-y-3">
            {isLoadingStocks ? (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </>
            ) : stocksData?.stocks.length ? (
              stocksData.stocks.map((stock) => (
                <StockSettingRow
                  key={stock.id}
                  stockId={stock.id}
                  stockName={stock.name}
                  institutionId={institutionId}
                  onSaved={handleSaved}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum estoque encontrado.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
