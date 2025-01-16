export enum Race {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  MIXED = 'MIXED',
  UNDECLARED = 'UNDECLARED',
  INDIGENOUS = 'INDIGENOUS',
}

const raceTranslations: Record<Race, string> = {
  BLACK: 'Preto',
  WHITE: 'Branco',
  YELLOW: 'Amarelo',
  MIXED: 'Pardo',
  UNDECLARED: 'Não declarado',
  INDIGENOUS: 'Indígena',
};

export function getRaceTranslation(race: Race): string {
  return raceTranslations[race] || 'Desconhecido';
}
