import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { fetchUsers } from '@/api/pharma/users/fetch-users'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/authContext'

import { UserTableFilters } from './user-table-filters'
import { UserTableRow } from './user-table-row'

export function Users() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const { data: usersResult } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers({ page }, token ?? ''),
  })

  function handlePagination(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Usuários" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <UserTableFilters />
            <Button
              className=""
              variant={'default'}
              onClick={() => navigate('/users/new')}
            >
              Novo Usuário
            </Button>
            {/* <NewUserDialog /> */}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[180px]">CPF</TableHead>
                  <TableHead className="w-[180px]">SUS</TableHead>
                  <TableHead className="w-[80px]">Sexo</TableHead>

                  <TableHead className="w-[100px]">Raça</TableHead>
                  <TableHead className="w-[50px]">Data de Nascimento</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersResult?.patients &&
                  usersResult.patients.map((item) => {
                    return <UserTableRow user={item} key={item.id} />
                  })}
              </TableBody>
            </Table>
          </div>

          {usersResult && (
            <Pagination
              pageIndex={usersResult.meta.page}
              totalCount={usersResult.meta.totalCount}
              perPage={10}
              onPageChange={handlePagination}
            />
          )}
        </div>
      </div>
    </>
  )
}
