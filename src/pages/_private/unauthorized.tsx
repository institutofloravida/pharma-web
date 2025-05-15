export default function Unauthorized() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">403 - Acesso Negado</h1>
      <p className="mt-4 text-gray-600">
        Você não tem permissão para acessar esta página.
      </p>
    </div>
  )
}
