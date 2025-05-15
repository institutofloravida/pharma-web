import {
  Bell,
  Building2,
  ChartArea,
  FileCog,
  FlaskConical,
  Layers,
  Layers2,
  MonitorCog,
  Pill,
  Settings,
  UserRoundCog,
  Users,
} from 'lucide-react'

import { OperatorRole } from '@/api/pharma/operators/register-operator'

import type { NavItem, SidebarSection } from '../sidebar'

export const ALL_ROLES = [
  OperatorRole.COMMON,
  OperatorRole.MANAGER,
  OperatorRole.SUPER_ADMIN,
]

export const sidebarSections: SidebarSection[] = [
  {
    label: 'Dashboard',
    singleItems: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: ChartArea,
        role: OperatorRole.COMMON,
      },
    ],
  },
  {
    label: 'Área Administrativa',
    role: [OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN],
    singleItems: [
      {
        name: 'Instituições',
        url: '/institutions',
        icon: Building2,
        role: [OperatorRole.SUPER_ADMIN],
      },
      {
        name: 'Operadores',
        url: '/operators',
        icon: UserRoundCog,
        role: OperatorRole.MANAGER,
      },
      {
        name: 'Estoques',
        url: '/stocks',
        icon: Layers2,
        role: [OperatorRole.MANAGER],
      },
    ],
    groupedItems: [
      {
        title: 'Cadastros Gerais',
        icon: MonitorCog,
        role: OperatorRole.MANAGER,
        items: [
          {
            name: 'Classes Terapêuticas',
            url: '/therapeutic-class',
          },
          {
            name: 'Formas Farmacêuticas',
            url: '/pharmaceutical-form',
          },
          {
            name: 'Fabricantes',
            url: '/manufacturer',
          },
          {
            name: 'Unidades de medida',
            url: '/unit-measure',
          },
          {
            name: 'Patologias',
            url: '/pathologies',
          },
          {
            name: 'Tipos de Movimentação',
            url: '/movement-types',
          },
        ],
      },
      {
        title: 'Medicamentos',
        icon: Pill,
        role: OperatorRole.MANAGER,
        items: [
          {
            name: 'Medicamentos',
            url: '/medicines',
          },
          {
            name: 'Variantes',
            url: '/medicines/variants',
          },
        ],
      },
    ],
  },
  {
    label: 'Área do Operador',
    singleItems: [
      {
        name: 'Teste',
        url: '/test',
        icon: FlaskConical,
      },
    ],
    groupedItems: [
      {
        title: 'Movimentações',
        icon: MonitorCog,
        items: [
          {
            name: 'Entradas',
            url: '/movement/entries',
            role: OperatorRole.MANAGER,
          },
          {
            name: 'Saídas',
            url: '/movement/exits',
            role: OperatorRole.MANAGER,
          },
          {
            name: 'Dispensas',
            url: '/dispensation',
            role: OperatorRole.COMMON,
          },
        ],
      },
      {
        title: 'Usuários',
        icon: Users,
        items: [
          { name: 'Usuários', url: '/users' },
          {
            name: 'Novo Usuário',
            url: '/users/new',
          },
        ],
      },
    ],
  },
  {
    label: 'Inventário',
    role: OperatorRole.COMMON,
    singleItems: [
      {
        name: 'Inventário',
        url: '/inventory',
        icon: Layers,
        role: OperatorRole.COMMON,
      },
    ],
  },
  {
    label: 'Relatórios',
    role: [OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN],
    groupedItems: [
      {
        title: 'Relatórios',
        icon: FileCog,
        items: [
          {
            name: 'Teste',
            url: '/reports',
          },
        ],
      },
    ],
  },
  {
    label: 'Mais',
    singleItems: [
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
  },
]

export function convertSidebarToNavItems(
  sidebarSections: SidebarSection[],
): NavItem[] {
  return sidebarSections.map((section) => ({
    title: section.label,
    children: [
      ...(section.singleItems?.map((item) => ({
        title: item.name,
        url: item.url,
      })) || []),
      ...(section.groupedItems?.map((group) => ({
        title: group.title,
        children: group.items.map((subItem) => ({
          title: subItem.name,
          url: subItem.url,
        })),
      })) || []),
    ],
  }))
}

export const NAV_ITEMS = convertSidebarToNavItems(sidebarSections)
