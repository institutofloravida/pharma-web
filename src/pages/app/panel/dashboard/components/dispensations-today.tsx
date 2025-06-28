import { useQuery } from '@tanstack/react-query'
import { Loader2, Pill } from 'lucide-react'

import { GetDispenseMetrics } from '@/api/pharma/dashboard/get-dispense-metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/authContext'

import { CardSkeleton } from './card-skeleton'

export function DispensationsTodayCard() {
  const { institutionId, token } = useAuth()

  const { data: dispenseMetrics, isLoading } = useQuery({
    queryFn: () =>
      GetDispenseMetrics({ institutionId: institutionId ?? '' }, token ?? ''),
    queryKey: ['metrics', 'dispense', institutionId],
    enabled: !!institutionId && !!token,
  })
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Dispensas (Hoje)
        </CardTitle>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Pill className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {dispenseMetrics ? (
          <>
            <span className="text-2xl font-bold">
              {dispenseMetrics.today.total}
            </span>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  dispenseMetrics.today.percentageAboveAverage > 0
                    ? 'text-emerald-500'
                    : dispenseMetrics.today.percentageAboveAverage < 0
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                }
              >
                {dispenseMetrics.today.percentageAboveAverage > 0
                  ? `+${dispenseMetrics.today.percentageAboveAverage}`
                  : dispenseMetrics.today.percentageAboveAverage}
                %
              </span>{' '}
              {dispenseMetrics.today.percentageAboveAverage >= 0
                ? 'acima da média'
                : 'abaixo da média'}
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
