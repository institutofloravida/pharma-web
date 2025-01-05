import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { LogOut } from 'lucide-react'

import { useAuth } from '@/contexts/authContext'

export function LogoutButton() {
  const { logout } = useAuth()
  return (
    <DropdownMenuItem onClick={logout}>
      <LogOut /> Log out
    </DropdownMenuItem>
  )
}
