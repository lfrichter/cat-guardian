export interface Cat {
  id: string
  name: string
  breed: string
  birthDate?: string
  gender: 'macho' | 'fêmea' | 'outro'
  colorPattern: string
  microchipNumber?: string
  isLost: boolean
  lostNotes?: string
  photoUrl?: string
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  ownerId?: string
  aiProfileSummary?: string
  aiProfileLocalized?: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

export type CreateCatInput = Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCatInput = Partial<CreateCatInput>

/**
 * Utility helper to extract localized AI profile summary based on current i18n locale ('en' | 'pt-BR')
 */
export function getLocalizedCatProfile(cat: Cat, currentLang = 'en'): string {
  if (cat.aiProfileLocalized) {
    const locText = cat.aiProfileLocalized[currentLang] || cat.aiProfileLocalized['en'] || cat.aiProfileLocalized['pt-BR']
    if (locText) return locText
  }
  return cat.aiProfileSummary || ''
}
