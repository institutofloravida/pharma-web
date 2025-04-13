import { Layers, Loader2, Pill } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

export function InventoryTodayCard() {
  const isLoadingMonthReceipt = false
  const monthReceipt = true
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Inventário</CardTitle>
        {isLoadingMonthReceipt ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Layers className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {monthReceipt ? (
          <>
            <span className="text-2xl font-bold">{Number(67)}</span>
            <p className="text-xs text-muted-foreground">
              <span className={Number(4) > 0 ? 'text-red-500' : 'text-red-500'}>
                04
              </span>{' '}
              zerados.
            </p>
            <p className="text-xs text-muted-foreground">
              <span
                className={Number(4) > 0 ? 'text-yellow-500' : 'text-red-500'}
              >
                02
              </span>{' '}
              próximo(s) da validade.
            </p>
            <p className="text-xs text-muted-foreground">
              <span
                className={Number(4) > 0 ? 'text-orange-500' : 'text-red-500'}
              >
                00
              </span>{' '}
              vencido(s).
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
