import { Helmet } from 'react-helmet-async'

import { DispensationsMonthCard } from './components/dispensation-month-card'
import { DispensationsChart } from './components/dispensations-chart'
import { DispensationsTodayCard } from './components/dispensations-today'
import { InventoryTodayCard } from './components/inventory-today-card'
import { MostAttendedTherapeuticsClassesChart } from './components/most-attended-therapeutics-classes-chart'
import { UsersCard } from './components/users-card'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <InventoryTodayCard />
          <DispensationsTodayCard />
          <DispensationsMonthCard />
          <UsersCard />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <DispensationsChart />
          <MostAttendedTherapeuticsClassesChart />
          {/* <ReceiptChart /> */}
          {/* <PopularProductsChart /> */}
        </div>
      </div>
    </>
  )
}
