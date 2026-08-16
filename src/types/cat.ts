export interface Cat {
  id: string
  name: string
  breed: string
  breedLocalized?: Record<string, string>
  birthDate?: string
  gender: 'macho' | 'fêmea' | 'outro'
  colorPattern: string
  microchipNumber?: string
  isLost: boolean
  lostNotes?: string
  photoUrl?: string
  ownerName?: string
  ownerPhone?: string
  ownerEmail?: string
  ownerId?: string
  aiProfileSummary?: string
  aiProfileLocalized?: Record<string, string>
  colorPatternLocalized?: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

export type CreateCatInput = Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCatInput = Partial<CreateCatInput>

/**
 * Utility helper to extract localized breed based on current i18n locale ('en' | 'pt-BR')
 */
export function getLocalizedBreed(cat: Cat, currentLang = 'en'): string {
  const isEn = currentLang.toLowerCase().startsWith('en')
  const isPt = currentLang.toLowerCase().startsWith('pt')

  if (cat.breedLocalized) {
    if (isEn && cat.breedLocalized['en']) return cat.breedLocalized['en']
    if (isPt && (cat.breedLocalized['pt-BR'] || cat.breedLocalized['pt'])) {
      return cat.breedLocalized['pt-BR'] || cat.breedLocalized['pt']!
    }
    const locText = cat.breedLocalized[currentLang] || cat.breedLocalized['en'] || cat.breedLocalized['pt-BR']
    if (locText) return locText
  }
  return cat.breed || ''
}

/**
 * Utility helper to extract localized AI profile summary based on current i18n locale ('en' | 'pt-BR')
 */
export function getLocalizedCatProfile(cat: Cat, currentLang = 'en'): string {
  const isEn = currentLang.toLowerCase().startsWith('en')
  const isPt = currentLang.toLowerCase().startsWith('pt')

  if (cat.aiProfileLocalized) {
    if (isEn && cat.aiProfileLocalized['en']) {
      return cat.aiProfileLocalized['en']
    }
    if (isPt && (cat.aiProfileLocalized['pt-BR'] || cat.aiProfileLocalized['pt'])) {
      return cat.aiProfileLocalized['pt-BR'] || cat.aiProfileLocalized['pt']!
    }
    const locText = cat.aiProfileLocalized[currentLang] || cat.aiProfileLocalized['en'] || cat.aiProfileLocalized['pt-BR']
    if (locText) return locText
  }

  if (isEn && cat.aiProfileSummary) {
    // If existing summary is already English prose
    if (!/[áàãâéêíóôõúç]/i.test(cat.aiProfileSummary) && /\b(cat|coat|fur|eyes|gentle|playful|tuxedo|tabby|white|black|calico|siamese)\b/i.test(cat.aiProfileSummary)) {
      return cat.aiProfileSummary
    }
    // Dynamic English fallback summary for custom/untranslated cats
    const breedName = getLocalizedBreed(cat, 'en')
    const colorDesc = getLocalizedColorPattern(cat, 'en').toLowerCase()
    return `Gentle ${breedName} cat with ${colorDesc} coat. Verified Cat Guardian safety profile.`
  }

  return cat.aiProfileSummary || ''
}

/**
 * Utility helper to extract localized color pattern description based on current i18n locale ('en' | 'pt-BR')
 */
export function getLocalizedColorPattern(cat: Cat, currentLang = 'en'): string {
  const isEn = currentLang.toLowerCase().startsWith('en')
  const isPt = currentLang.toLowerCase().startsWith('pt')

  if (cat.colorPatternLocalized) {
    if (isEn && cat.colorPatternLocalized['en']) {
      return cat.colorPatternLocalized['en']
    }
    if (isPt && (cat.colorPatternLocalized['pt-BR'] || cat.colorPatternLocalized['pt'])) {
      return cat.colorPatternLocalized['pt-BR'] || cat.colorPatternLocalized['pt']!
    }
    const locText = cat.colorPatternLocalized[currentLang] || cat.colorPatternLocalized['en'] || cat.colorPatternLocalized['pt-BR']
    if (locText) return locText
  }
  return cat.colorPattern || ''
}
