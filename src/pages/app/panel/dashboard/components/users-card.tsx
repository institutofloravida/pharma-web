import { useQuery } from "@tanstack/react-query";
import { Loader2, Pill, UserPlus } from "lucide-react";

import { GetUserMetrics } from "@/api/pharma/dashboard/get-users-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";

import { CardSkeleton } from "./card-skeleton";

export function UsersCard() {
  const { institutionId, token } = useAuth();

  const REFRESH_INTERVAL_MS = 60_000;
  const { data: usersMetrics, isLoading } = useQuery({
    queryFn: () =>
      GetUserMetrics({ institutionId: institutionId ?? "" }, token ?? ""),
    queryKey: ["metrics", "users", institutionId],
    enabled: !!institutionId && !!token,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Usuários</CardTitle>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {usersMetrics ? (
          <>
            <span className="text-2xl font-bold">{usersMetrics.total}</span>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  usersMetrics.receiveMonth > 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }
              >
                {usersMetrics.receiveMonth > 0
                  ? `${usersMetrics.receiveMonth}`
                  : usersMetrics.receiveMonth}
              </span>{" "}
              receberam esse mês.
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  );
}
