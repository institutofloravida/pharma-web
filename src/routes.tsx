import { createBrowserRouter } from 'react-router-dom'

import { OperatorRole } from './api/pharma/operators/register-operator'
import { AuthLayout } from './pages/_layouts/auth'
import PanelLayout from './pages/_layouts/panel'
import { PrivateRoute } from './pages/_private/private-route'
import Unauthorized from './pages/_private/unauthorized'
import { SignIn } from './pages/app/auth/sign-in'
import { Institutions } from './pages/app/panel/auxiliary-records/institutions/institutions'
import { Manufacturers } from './pages/app/panel/auxiliary-records/manufacturers/manufacturers'
import { MovementTypes } from './pages/app/panel/auxiliary-records/movement-type/movement-types'
import { Pathologies } from './pages/app/panel/auxiliary-records/pathology/pathologies'
import { PharmaceuticalForms } from './pages/app/panel/auxiliary-records/pharmaceutical-form/pharmaceutical-forms'
import { Stocks } from './pages/app/panel/auxiliary-records/stocks/stocks'
import { TherapeuticClass } from './pages/app/panel/auxiliary-records/therapeutic-class/therapeutic-class'
import { UnitMeasure } from './pages/app/panel/auxiliary-records/unit-measure/units-measure'
import { Dashboard } from './pages/app/panel/dashboard/dashboard'
import { Dispensations } from './pages/app/panel/dispensation/dispensation'
import { NewDispensation } from './pages/app/panel/dispensation/new-dispensation'
import { InventoryMedicineDetails } from './pages/app/panel/inventory/inventory-medicine-details'
import { Inventory } from './pages/app/panel/inventory/list-inventory'
import { MedicinesVariants } from './pages/app/panel/medicine-variant/medicines-variants'
import { Medicines } from './pages/app/panel/medicines/medicines'
import { MedicinesEntries } from './pages/app/panel/movement/entry/medicines-entries'
import { MedicinesExits } from './pages/app/panel/movement/exit/medicines-exits'
import { Operators } from './pages/app/panel/operators/operators'
import { NewUser } from './pages/app/panel/users/new-user'
import { UpdateUser } from './pages/app/panel/users/update-user'
import { Users } from './pages/app/panel/users/users'
import { DispensesReport } from './pages/app/reports/dispenses-in-a-period/dispenses-report'
import { MovimentationReport } from './pages/app/reports/movimentation-in-a-period/movimentation-report'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PanelLayout />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [{ path: 'sign-in', element: <SignIn /> }],
  },
  {
    path: '/',
    element: <PanelLayout />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: 'reports',
        children: [
          {
            path: 'dispenses-in-a-period',
            element: (
              <PrivateRoute>
                <DispensesReport />
              </PrivateRoute>
            ),
          },
          {
            path: 'movimentation-in-a-period',
            element: (
              <PrivateRoute>
                <MovimentationReport />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: 'panel',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: 'operators',
        element: (
          <PrivateRoute
            allowedRoles={[OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN]}
          >
            <Operators />
          </PrivateRoute>
        ),
      },
      {
        path: 'institutions',
        element: (
          <PrivateRoute>
            <Institutions />
          </PrivateRoute>
        ),
      },
      {
        path: 'stocks',
        element: (
          <PrivateRoute>
            <Stocks />
          </PrivateRoute>
        ),
      },
      {
        path: 'therapeutic-class',
        element: (
          <PrivateRoute>
            <TherapeuticClass />
          </PrivateRoute>
        ),
      },
      {
        path: 'pharmaceutical-form',
        element: (
          <PrivateRoute>
            <PharmaceuticalForms />
          </PrivateRoute>
        ),
      },
      {
        path: 'manufacturer',
        element: (
          <PrivateRoute>
            <Manufacturers />
          </PrivateRoute>
        ),
      },
      {
        path: 'unit-measure',
        element: (
          <PrivateRoute>
            <UnitMeasure />
          </PrivateRoute>
        ),
      },
      {
        path: 'pathologies',
        element: (
          <PrivateRoute>
            <Pathologies />
          </PrivateRoute>
        ),
      },
      {
        path: 'movement-types',
        element: (
          <PrivateRoute>
            <MovementTypes />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/medicines',
    element: <PanelLayout />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Medicines />
          </PrivateRoute>
        ),
      },
      {
        path: 'variants',
        element: (
          <PrivateRoute>
            <MedicinesVariants />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/movement',
    element: <PanelLayout />,
    children: [
      {
        path: 'entries',
        element: (
          <PrivateRoute>
            <MedicinesEntries />
          </PrivateRoute>
        ),
      },
      {
        path: 'exits',
        element: (
          <PrivateRoute>
            <MedicinesExits />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/users',
    element: <PanelLayout />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: 'new',
        element: (
          <PrivateRoute>
            <NewUser />
          </PrivateRoute>
        ),
      },
      {
        path: 'edit/:id',
        element: (
          <PrivateRoute>
            <UpdateUser />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/dispensation',
    element: <PanelLayout />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Dispensations />
          </PrivateRoute>
        ),
      },
      {
        path: 'new',
        element: (
          <PrivateRoute>
            <NewDispensation />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/inventory',
    element: <PanelLayout />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        ),
      },
      {
        path: ':id',
        element: (
          <PrivateRoute>
            <InventoryMedicineDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
])
