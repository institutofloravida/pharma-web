import { Helmet } from 'react-helmet-async'

import { NewDispensationForm } from './new-dispensation-form'

export function NewDispensation() {
  return (
    <>
      <Helmet title="Nova Dispensa" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Nova Dispensa de Medicamento
        </h1>
        <NewDispensationForm />
      </div>
    </>
  )
}
