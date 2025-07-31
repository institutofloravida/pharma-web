import type { InstitutionType } from '@/api/pharma/auxiliary-records/institution/register-institution'

const institutionTypeTranslations: Record<InstitutionType, string> = {
  PUBLIC: 'Pública',
  PRIVATE: 'Privada',
  ONG: 'ONG',
}

export function getInstitutionTypeTranslation(
  institutionTypeDirection: InstitutionType,
): string {
  return institutionTypeTranslations[institutionTypeDirection] || 'Desconhecido'
}
