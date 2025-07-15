import { Helmet } from 'react-helmet-async'

import { MovimentationReportForm } from './movimentation-report-form'

export function MovimentationReport() {
  return (
    <>
      <Helmet title="Relatório de Movimentação" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Relatório de Movimentações no Período
        </h1>
        <div className="space-y-2.5">
          <div className="flex max-w-[1000px] items-center justify-between">
            <MovimentationReportForm />
          </div>
          <div className="rounded-md border"></div>
        </div>
      </div>
    </>
  )
}
