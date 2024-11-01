import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api } from '@/lib/axios'

interface AuthContextType {
  token: string | null
  login: (newToken: string) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
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

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await api.get('/validate-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setIsAuthenticated(response.data.isValid)
        } catch (error) {
          logout()
        }
      } else {
        setIsAuthenticated(false)
      }
      setLoading(false) // Atualiza o estado de carregamento ao final
    }

    validateToken()
  }, [token])

  const login = (newToken: string) => {
    setToken(newToken)
    setIsAuthenticated(true)
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, loading }}
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
