import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/contexts/authContext'

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useAuth()
  console.log(token)
  return token ? <>{children}</> : <Navigate to="/sign-in" />
}
