import { createBrowserRouter } from 'react-router-dom'

import { LoginForm } from './components/login-form'
import { AuthLayout } from './pages/_layouts/auth'
import PanelLayout from './pages/_layouts/panel'
import { PrivateRoute } from './pages/_private/private-route'
import { SignIn } from './pages/app/auth/sign-in'
import { Institutions } from './pages/app/panel/institutions/institutions'
import { Operators } from './pages/app/panel/operators/operators'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [{ path: '/sign-in', element: <SignIn /> }],
  },

  {
    path: '/',
    element: <PanelLayout />,
    children: [
      {
        path: '/panel',
        element: (
          <PrivateRoute>
            <LoginForm />
          </PrivateRoute>
        ),
      },
      {
        path: '/operators',
        element: (
          <PrivateRoute>
            <Operators />
          </PrivateRoute>
        ),
      },
      {
        path: '/institutions',
        element: (
          <PrivateRoute>
            <Institutions />
          </PrivateRoute>
        ),
      },
    ],
  },
])
