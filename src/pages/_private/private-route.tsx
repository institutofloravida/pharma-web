import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import type { OperatorRole } from '@/api/pharma/operators/register-operator'
import { useAuth } from '@/contexts/authContext'

interface PrivateRouteProps {
  children: ReactNode
  allowedRoles?: OperatorRole[]
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, loading, token, me } = useAuth()

  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }

  if (allowedRoles && me && !allowedRoles.includes(me.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
