export enum Race {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  MIXED = 'MIXED',
  UNDECLARED = 'UNDECLARED',
  INDIGENOUS = 'INDIGENOUS',
}

const raceTranslations: Record<Race, string> = {
  BLACK: 'Preta',
  WHITE: 'Branca',
  YELLOW: 'Amarela',
  MIXED: 'Parda',
  UNDECLARED: 'Não declarado',
  INDIGENOUS: 'Indígena',
};

export function getRaceTranslation(race: Race): string {
  return raceTranslations[race] || 'Desconhecido';
}
