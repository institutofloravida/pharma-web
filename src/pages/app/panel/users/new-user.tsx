import { Helmet } from 'react-helmet-async'

import { NewUserForm } from './new-user-form'

export function NewUser() {
  return (
    <>
      <Helmet title="Usuários" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
        <NewUserForm />
      </div>
    </>
  )
}
