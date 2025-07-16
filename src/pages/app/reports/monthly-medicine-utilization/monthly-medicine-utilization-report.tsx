import { Helmet } from 'react-helmet-async'

import { MonthlyMedicineUtilizationReportForm } from './monthly-medicine-utilization-report-form'

export function MonthlyMedicineUtilizationReport() {
  return (
    <>
      <Helmet title="Relatório de Utilização" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Relatório de Utiização de Medicamentos Mensal
        </h1>
        <div className="space-y-2.5">
          <div className="flex max-w-[1000px] items-center justify-between">
            <MonthlyMedicineUtilizationReportForm />
          </div>
          <div className="rounded-md border"></div>
        </div>
      </div>
    </>
  )
}
