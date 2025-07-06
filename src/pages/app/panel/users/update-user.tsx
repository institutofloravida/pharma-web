import { Helmet } from 'react-helmet-async'

import { UpdateUserForm } from './update-user-form'

export function UpdateUser() {
  return (
    <>
      <Helmet title="Atualizar usuário" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Atualizar Usuário</h1>
        <UpdateUserForm />
      </div>
    </>
  )
}
