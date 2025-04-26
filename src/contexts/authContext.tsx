import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useState } from 'react'

import { getOperatorDetails } from '@/api/pharma/auth/get-operator-details'
import { Operator } from '@/api/pharma/operators/fetch-operators'
import { apiPharma } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

interface AuthContextType {
  institutionId: string | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  me: Operator | null
  login: (newToken: string) => void
  logout: () => void
  selectInstitution: (institutionId: string | null) => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [institutionId, setInstitutionId] = useState<string | null>(
    localStorage.getItem('institutionId'),
  )

  const clearAuth = () => {
    setToken(null)
    setInstitutionId(null)
    localStorage.removeItem('token')
    localStorage.removeItem('institutionId')
    queryClient.invalidateQueries()
    queryClient.removeQueries({ queryKey: ['me'] })
  }

  const shouldFetch = Boolean(token)

  const { data: me, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      const response = await apiPharma.get('/validate-token', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.data.isValid) throw new Error('Token inválido')
      return getOperatorDetails(token ?? '')
    },
    enabled: shouldFetch,
    retry: false,
  })

  const isAuthenticated = Boolean(token) && !isLoading && !!me
  const isLoadingAuth = isLoading || !token

  const login = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  const selectInstitution = (newInstitutionId: string | null) => {
    setInstitutionId(newInstitutionId)
    if (newInstitutionId) {
      localStorage.setItem('institutionId', newInstitutionId)
      queryClient.invalidateQueries({
        queryKey: ['data-on-institution'],
      })
    } else {
      localStorage.removeItem('institutionId')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout: clearAuth,
        isAuthenticated,
        loading: isLoadingAuth,
        me: me?.operator ?? null,
        institutionId,
        selectInstitution,
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
