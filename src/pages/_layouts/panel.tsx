import { useQuery } from '@tanstack/react-query'
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BriefcaseMedical,
  Building2,
  ChevronRight,
  ChevronsUpDown,
  Command,
  FileCog,
  FlaskConical,
  Folder,
  Forward,
  GalleryVerticalEnd,
  Layers,
  Layers2,
  Loader2,
  LogOut,
  MonitorCog,
  MoreHorizontal,
  Pill,
  Settings,
  Trash2,
  UserRoundCog,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { getOperatorDetails } from '@/api/pharma/auth/get-operator-details'
import { OperatorRole } from '@/api/pharma/operators/register-operator'
import { SelectInstitutionGlobal } from '@/components/selects/select-institution-global'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/authContext'
import { useDynamicBreadcrumbTrail } from '@/hooks/use-dynamic-breadcrumb-title'
import { NAV_ITEMS, sidebarSections } from '@/lib/data/sidebar-config'
import { hasAccess, type NavItem, type SidebarSection } from '@/lib/sidebar'

// utils/breadcrumb.ts
export function getBreadcrumbTrail(
  navItems: NavItem[],
  pathname: string,
): NavItem[] {
  const trail: NavItem[] = []

  const traverse = (
    items: NavItem[],
    path: string,
    parents: NavItem[] = [],
  ): NavItem[] => {
    for (const item of items) {
      const currentTrail = [...parents, item]
      if (item.url === path) return currentTrail
      if (item.children) {
        const result = traverse(item.children, path, currentTrail)
        if (result.length > 0) return result
      }
    }
    return []
  }

  return traverse(navItems, pathname)
}

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Instituto Flora Vida',
      logo: GalleryVerticalEnd,
      plan: 'ONG',
    },
    {
      name: 'UBS - módulo 22',
      logo: AudioWaveform,
      plan: 'Pública',
    },
    {
      name: 'UBS - módulo 30',
      logo: Command,
      plan: 'Pública',
    },
  ],
  admAreaSingleItems: [
    {
      name: 'Instituições',
      url: '/institutions',
      icon: Building2,
    },
    {
      name: 'Operadores',
      url: '/operators',
      icon: UserRoundCog,
    },
    {
      name: 'Estoques',
      url: '/stocks',
      icon: Layers2,
    },
  ],
  admAreaManyItems: [
    {
      title: 'Cadastros Gerais',
      url: '#',
      icon: MonitorCog,
      isActive: true,
      items: [
        {
          title: 'Classes Terapêuticas',
          url: '/therapeutic-class',
        },
        {
          title: 'Formas Farmacêuticas',
          url: '/pharmaceutical-form',
        },
        {
          title: 'Fabricantes',
          url: '/manufacturer',
        },
        {
          title: 'Unidades de medida',
          url: '/unit-measure',
        },
        {
          title: 'Patologias',
          url: '/pathologies',
        },
        {
          title: 'Tipos de Movimentação',
          url: '/movement-types',
        },
      ],
    },
    {
      title: 'Medicamentos',
      url: '#',
      icon: Pill,
      isActive: true,
      items: [
        {
          title: 'Medicamentos',
          url: '/medicines',
        },
        {
          title: 'Variantes',
          url: '/medicines/variants',
        },
      ],
    },
  ],

  operatorAreaSingleItem: [
    {
      name: 'Teste',
      url: '/test',
      icon: FlaskConical,
    },
  ],
  operatorAreaManyItems: [
    {
      title: 'Movimentações',
      url: '#',
      icon: MonitorCog,
      isActive: true,
      items: [
        {
          title: 'Entradas',
          url: '/movement/entries',
        },
        {
          title: 'Saídas',
          url: '/movement/exits',
        },
        {
          title: 'Dispensas',
          url: '/dispensation',
        },
      ],
    },
    {
      title: 'Usuários',
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'Usuários',
          url: '/users',
        },
        {
          title: 'Novo Usuário',
          url: '/users/new',
        },
      ],
    },
    // {
    //   title: 'Dispensas',
    //   url: '#',
    //   icon: BriefcaseMedical,
    //   isActive: true,
    //   items: [
    //     {
    //       title: 'Nova',
    //       url: '/dispensation/new',
    //     },
    //   ],
    // },
  ],

  inventoryAreaSingleItem: [
    {
      name: 'Inventário',
      url: '/inventory',
      icon: Layers,
    },
  ],
  reportsManyItems: [
    {
      title: 'Relatórios',
      url: '/reports',
      icon: FileCog,
      isActive: true,
      items: [
        {
          title: 'Teste',
          url: '/reports',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Configurações',
      url: '#',
      icon: Settings,
    },
    {
      name: 'Notificações',
      url: '#',
      icon: Bell,
    },
  ],
}

// export const NAV_ITEMS: NavItem[] = [
//   {
//     title: 'Dashboard',
//     url: '/panel',
//     icon: MonitorCog,
//   },
//   {
//     title: 'Instituições',
//     url: '/institutions',
//     icon: Building2,
//     roles: ['admin'],
//   },
//   {
//     title: 'Operadores',
//     url: '/operators',
//     icon: UserRoundCog,
//     roles: ['admin'],
//   },
//   {
//     title: 'Cadastros Gerais',
//     url: '#',
//     icon: Layers2,
//     roles: ['admin'],
//     children: [
//       { title: 'Classes Terapêuticas', url: '/therapeutic-class' },
//       { title: 'Formas Farmacêuticas', url: '/pharmaceutical-form' },
//       { title: 'Fabricantes', url: '/manufacturer' },
//     ],
//   },
//   {
//     title: 'Movimentações',
//     url: '#',
//     icon: MonitorCog,
//     roles: ['operator'],
//     children: [
//       { title: 'Entradas', url: '/movement/entries' },
//       { title: 'Saídas', url: '/movement/exits' },
//     ],
//   },
//   {
//     title: 'Inventário',
//     url: '/inventory',
//     icon: Layers,
//     roles: ['inventory'],
//   },
//   {
//     title: 'Relatórios',
//     url: '/reports',
//     icon: FileCog,
//   },
// ]

export default function PanelLayout() {
  const [activeTeam, setActiveTeam] = useState(data.teams[0])
  const navigate = useNavigate()
  const { token, logout, isAuthenticated, loading, me } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const { data: operatorResult, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: () => getOperatorDetails(token ?? ''),
  })

  if (!isAuthenticated) {
    navigate('/sign-in')
  }

  return (
    <>
      {loading ? (
        <>
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        </>
      ) : (
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SelectInstitutionGlobal />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              {sidebarSections
                .filter((section) =>
                  hasAccess(me ? me.role : OperatorRole.COMMON, section.role),
                )
                .map((section) => (
                  <SidebarGroup key={section.label}>
                    <SidebarGroupLabel>{section.label}</SidebarGroupLabel>

                    {section.singleItems
                      ?.filter((item) =>
                        hasAccess(
                          me ? me.role : OperatorRole.COMMON,
                          item.role,
                        ),
                      )
                      .map((item) => {
                        const isActive = currentPath === item.url

                        return (
                          <SidebarMenuButton
                            tooltip={item.name}
                            asChild
                            key={item.name}
                            className={
                              isActive
                                ? 'bg-muted font-semibold text-primary'
                                : ''
                            }
                          >
                            <Link to={item.url}>
                              {item.icon && <item.icon />}
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        )
                      })}

                    <SidebarMenu>
                      {section.groupedItems
                        ?.filter((group) =>
                          hasAccess(
                            me ? me.role : OperatorRole.COMMON,
                            group.role,
                          ),
                        )
                        .map((group) => (
                          <Collapsible
                            key={group.title}
                            asChild
                            className="group/collapsible"
                          >
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={group.title}>
                                  {group.icon && <group.icon />}
                                  <span>{group.title}</span>
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {group.items
                                    .filter((sub) =>
                                      hasAccess(
                                        me ? me.role : OperatorRole.COMMON,
                                        sub.role,
                                      ),
                                    )
                                    .map((sub) => {
                                      const isActive = currentPath === sub.url

                                      return (
                                        <SidebarMenuSubItem key={sub.name}>
                                          <SidebarMenuSubButton
                                            asChild
                                            className={
                                              isActive
                                                ? 'bg-muted font-semibold text-primary'
                                                : ''
                                            }
                                          >
                                            <Link to={sub.url}>
                                              <span>{sub.name}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      )
                                    })}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        ))}
                    </SidebarMenu>
                  </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={''}
                            alt={operatorResult?.operator?.name}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {isLoading ? (
                              <Skeleton className="mb-2 h-4 w-20" />
                            ) : (
                              operatorResult?.operator?.name
                            )}
                          </span>
                          <span className="truncate text-xs">
                            {isLoading ? (
                              <Skeleton className="w-50 h-4" />
                            ) : (
                              operatorResult?.operator?.email
                            )}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={operatorResult?.operator?.name}
                              alt={operatorResult?.operator?.name}
                            />
                            <AvatarFallback className="rounded-lg">
                              CN
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {operatorResult?.operator?.name}
                            </span>
                            <span className="truncate text-xs">
                              {operatorResult?.operator?.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Minha conta
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      {/* <LogoutButton /> */}
                      <DropdownMenuItem onClick={logout}>
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <header className="border-b-1 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <AppBreadcrumb />
              </div>
              <ModeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 pt-5">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  )
}

const AppBreadcrumb = () => {
  const { pathname } = useLocation()
  const breadcrumbTrail = getBreadcrumbTrail(NAV_ITEMS, pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbTrail.map((item, index) => (
          <BreadcrumbItem key={`breadcrumb-${index}`}>
            <BreadcrumbPage>{item.title}</BreadcrumbPage>
            {index < breadcrumbTrail.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
