export type EntryType =
  | 'MOVEMENT_TYPE'
  | 'TRANSFER'
  | 'INVENTORY'
  | 'CORRECTION'

const entryTypeTranslations: Record<EntryType, string> = {
  MOVEMENT_TYPE: 'Tipo de Movimento',
  TRANSFER: 'Transferência',
  INVENTORY: 'Inventário',
  CORRECTION: 'Correção',
}

export function getEntryTypeTranslation(entryType: EntryType): string {
  return entryTypeTranslations[entryType] ?? 'Desconhecido'
}

/**
 * Traduz o campo movementType retornado pela API, que pode ser:
 * - Um valor de enum cru (ex: "CORRECTION", "TRANSFER", "DISPENSATION")
 * - Um nome personalizado de tipo de movimento (ex: "Compra NF")
 * Retorna o valor traduzido se for um enum conhecido, ou o valor original caso contrário.
 */
const allMovementLabels: Record<string, string> = {
  ...entryTypeTranslations,
  DISPENSATION: 'Dispensa',
  DONATION: 'Doação',
  EXPIRATION: 'Vencimento',
}

export function translateMovementTypeLabel(value: string): string {
  return allMovementLabels[value] ?? value
}
