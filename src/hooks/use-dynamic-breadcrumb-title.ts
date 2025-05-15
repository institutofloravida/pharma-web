import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@/contexts/authContext'
import { dynamicBreadcrumbResolvers } from '@/lib/utils/dynamic-breadcrumbs'

export const useDynamicBreadcrumbTrail = () => {
  const location = useLocation()
  const pathname = location.pathname
  const { token } = useAuth()

  const resolver = dynamicBreadcrumbResolvers.find((r) => r.match(pathname))
  const id = pathname.split('/').pop() ?? ''

  const queryKey = resolver?.queryKey(id) ?? []
  const queryFn = resolver
    ? () => resolver.queryFn(id, token ?? '')
    : async () => null

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn,
    enabled: !!resolver && !!id && !!token,
  })

  return {
    title: resolver ? (isLoading ? 'Carregando...' : data) : null,
  }
}
