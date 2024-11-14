import { createBrowserRouter } from 'react-router-dom'

import { LoginForm } from './components/login-form'
import { AuthLayout } from './pages/_layouts/auth'
import PanelLayout from './pages/_layouts/panel'
import { PrivateRoute } from './pages/_private/private-route'
import { SignIn } from './pages/app/auth/sign-in'
import { Institutions } from './pages/app/panel/auxiliary-records/institutions/institutions'
import { Manufacturers } from './pages/app/panel/auxiliary-records/manufacturers/manufacturers'
import { Pathologies } from './pages/app/panel/auxiliary-records/pathology/pathologies'
import { PharmaceuticalForms } from './pages/app/panel/auxiliary-records/pharmaceutical-form/pharmaceutical-forms'
import { Stocks } from './pages/app/panel/auxiliary-records/stocks/stocks'
import { TherapeuticClass } from './pages/app/panel/auxiliary-records/therapeutic-class/therapeutic-class'
import { UnitMeasure } from './pages/app/panel/auxiliary-records/unit-measure/units-measure'
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
      {
        path: '/stocks',
        element: (
          <PrivateRoute>
            <Stocks />
          </PrivateRoute>
        ),
      },
      {
        path: '/therapeutic-class',
        element: (
          <PrivateRoute>
            <TherapeuticClass />
          </PrivateRoute>
        ),
      },
      {
        path: '/pharmaceutical-form',
        element: (
          <PrivateRoute>
            <PharmaceuticalForms />
          </PrivateRoute>
        ),
      },
      {
        path: '/manufacturer',
        element: (
          <PrivateRoute>
            <Manufacturers />
          </PrivateRoute>
        ),
      },
      {
        path: '/unit-measure',
        element: (
          <PrivateRoute>
            <UnitMeasure />
          </PrivateRoute>
        ),
      },
      {
        path: '/pathologies',
        element: (
          <PrivateRoute>
            <Pathologies />
          </PrivateRoute>
        ),
      },
    ],
  },
])
