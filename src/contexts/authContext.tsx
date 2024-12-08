import { useQuery } from '@tanstack/react-query'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getOperatorDetails } from '@/api/operators/get-operator-details'
import type { Operator } from '@/api/operators/get-operators'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  me: Operator | null
  login: (newToken: string) => void
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const clearAuth = () => {
    setToken(null)
    setIsAuthenticated(false)
    queryClient.invalidateQueries({ queryKey: ['me'] })
    localStorage.removeItem('token')
  }

  const { data: me, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      try {
        const response = await api.get('/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.data.isValid) throw new Error('Token inválido')
        return getOperatorDetails(token ?? '')
      } catch (error) {
        clearAuth()
        throw error
      }
    },
    enabled: Boolean(token),
  })

  useEffect(() => {
    if (!token) setLoading(false)
  }, [token])

  const login = (newToken: string) => {
    setToken(newToken)
    setIsAuthenticated(true)
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    clearAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        loading: loading || isLoading,
        me: me?.operator ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
