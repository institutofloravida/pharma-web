import { useQuery } from '@tanstack/react-query'
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BriefcaseMedical,
  ChevronRight,
  ChevronsUpDown,
  Command,
  FlaskConical,
  Folder,
  Forward,
  GalleryVerticalEnd,
  Layers2,
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
import { Link, Outlet, useLocation } from 'react-router-dom'

import { getOperatorDetails } from '@/api/pharma/auth/get-operator-details'
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
          title: 'Instituições',
          url: '/institutions',
        },

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
    {
      title: 'Dispensas',
      url: '#',
      icon: BriefcaseMedical,
      isActive: true,
      items: [
        {
          title: 'Todas',
          url: '/dispensation',
        },
        {
          title: 'Nova',
          url: '/dispensation/new',
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

export default function PanelLayout() {
  const [activeTeam, setActiveTeam] = useState(data.teams[0])
  const { pathname } = useLocation()
  const breadCrumpItems = pathname.split('/').filter((item) => item.length > 0)
  const { token, logout } = useAuth()

  const { data: operatorResult, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: () => getOperatorDetails(token ?? ''),
  })

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SelectInstitutionGlobal />
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeTeam.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeTeam.plan}
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
                  {data.teams.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground"></div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Área Administrativa</SidebarGroupLabel>
            {data.admAreaSingleItems.map((item) => {
              return (
                <SidebarMenuButton tooltip={item.name} asChild key={item.name}>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              )
            })}
            <SidebarMenu>
              {data.admAreaManyItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Área do Operador</SidebarGroupLabel>
            {data.operatorAreaSingleItem.map((item) => {
              return (
                <SidebarMenuButton tooltip={item.name} asChild key={item.name}>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              )
            })}
            <SidebarMenu>
              {data.operatorAreaManyItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel>Mais</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
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
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadCrumpItems.map((item, index) => (
                  <BreadcrumbItem key={`breadcrumb-${index}`}>
                    <BreadcrumbPage>{item}</BreadcrumbPage>
                    {index < breadCrumpItems.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
