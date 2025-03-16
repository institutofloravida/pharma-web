import type { OperatorRole } from '@/api/pharma/operators/register-operator'

const operatorRoleTranslations: Record<OperatorRole, string> = {
  COMMON: 'COMUM',
  MANAGER: 'ADMINISTRADOR',
  SUPER_ADMIN: 'SUPER USUÁRIO',
}

export function getOperatorRoleTranslation(
  operatorRoleDirection: OperatorRole,
): string {
  return operatorRoleTranslations[operatorRoleDirection] || 'Desconhecido'
}
