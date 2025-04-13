import { Loader2, Pill, UserPlus } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

export function UsersCard() {
  const isLoadingMonthReceipt = false
  const monthReceipt = true
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Usuários</CardTitle>
        {isLoadingMonthReceipt ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {monthReceipt ? (
          <>
            <span className="text-2xl font-bold">{Number(189)}</span>
            <p className="text-xs text-muted-foreground">
              <span
                className={Number(55) > 0 ? 'text-emerald-500' : 'text-red-500'}
              >
                {Number(55) > 0 ? `${Number(55)}` : Number(55)}
              </span>{' '}
              receberam esse mês.
            </p>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
