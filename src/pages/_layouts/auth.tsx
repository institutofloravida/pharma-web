import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex h-screen items-center justify-center antialiased">
      <Outlet />
    </div>
  )
}
