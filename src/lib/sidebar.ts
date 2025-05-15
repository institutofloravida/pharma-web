import { LucideIcon } from 'lucide-react'

import { OperatorRole } from '@/api/pharma/operators/register-operator'

export type NavItem = {
  title: string
  url?: string
  icon?: React.ElementType
  children?: NavItem[]
  roles?: string[]
}

export interface SidebarLinkItem {
  name: string
  url: string
  icon?: LucideIcon
  role?: OperatorRole | OperatorRole[]
}

export interface SidebarGroupItem {
  title: string
  icon?: LucideIcon
  items: SidebarLinkItem[]
  role?: OperatorRole | OperatorRole[]
}

export interface SidebarSection {
  label: string
  singleItems?: SidebarLinkItem[]
  groupedItems?: SidebarGroupItem[]
  role?: OperatorRole | OperatorRole[]
}

const roleHierarchy: Record<OperatorRole, number> = {
  [OperatorRole.COMMON]: 0,
  [OperatorRole.MANAGER]: 1,
  [OperatorRole.SUPER_ADMIN]: 2,
}

export function hasAccess(
  userRole: OperatorRole,
  itemRole?: OperatorRole | OperatorRole[],
): boolean {
  if (!itemRole) return true

  const userLevel = roleHierarchy[userRole]

  if (Array.isArray(itemRole)) {
    return itemRole.some((role) => userLevel >= roleHierarchy[role])
  }

  return userLevel >= roleHierarchy[itemRole]
}
