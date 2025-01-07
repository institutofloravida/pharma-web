import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, CircleOff, Command } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  fetchInstitutions,
  type Institution,
} from '@/api/auxiliary-records/institution/fetch-institutions'
import { useAuth } from '@/contexts/authContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { SidebarMenuButton } from '../ui/sidebar'

export function SelectInstitutionGlobal() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { token, selectInstitution, institutionId } = useAuth()

  const { data: institutions, isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => fetchInstitutions({ page: 1 }, token ?? ''),
    enabled: !!institutionId,
  })

  const [activeInstitution, setActiveInstitution] =
    useState<Institution | null>(null)

  useEffect(() => {
    if (institutions && institutionId) {
      const currentInstitution = institutions.find(
        (institution) => institution.id === institutionId,
      )
      setActiveInstitution(currentInstitution ?? null)
    }
  }, [institutions, institutionId])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {activeInstitution?.name || 'Selecionar instituição'}
            </span>
            <span className="truncate text-xs">
              {activeInstitution ? 'Pública' : 'Nenhuma selecionada'}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Instituições
        </DropdownMenuLabel>
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : institutions && institutions.length > 0 ? (
          institutions.map((institution, index) => (
            <DropdownMenuItem
              key={institution.id}
              onClick={() => {
                selectInstitution(institution.id)
                setActiveInstitution(institution)
                navigate(0)
              }}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Command className="size-4 shrink-0" />
              </div>
              {institution.name}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma instituição disponível
          </div>
        )}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
