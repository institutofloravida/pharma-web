export enum MovementTypeDirection {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

const movementTypeTranslations: Record<MovementTypeDirection, string> = {
  ENTRY: 'ENTRADA',
  EXIT: 'SAÍDA'
};

export function getMovementTypeTranslation(movementTypeDirection: MovementTypeDirection): string {
  return movementTypeTranslations[movementTypeDirection] || 'Desconhecido';
}
