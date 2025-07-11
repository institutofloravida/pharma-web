import { Helmet } from 'react-helmet-async'

import { DispensesReportForm } from './dispenses-report-form'

export function DispensesReport() {
  return (
    <>
      <Helmet title="Relatório de Dispensas" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Relatório de Dispensas no Período
        </h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <DispensesReportForm />
          </div>
          <div className="rounded-md border"></div>
        </div>
      </div>
    </>
  )
}
