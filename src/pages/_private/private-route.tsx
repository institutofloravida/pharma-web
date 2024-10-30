import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/contexts/authContext'

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    // Pode adicionar uma tela de carregamento ou apenas retornar `null`
    return <div>Carregando...</div>
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" />
}
