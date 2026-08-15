import { describe, it, expect } from 'vitest'
import { aiService } from './ai-service'
import { AI_SAFETY_DISCLAIMER } from './ai-prompts'

describe('aiService (Gemini & Guardian AI)', () => {
  it('generates descriptive cat safety profile summary', async () => {
    const profile = await aiService.generateCatProfile({
      name: 'Kiara',
      breed: 'SRD',
      gender: 'fêmea',
      colorPattern: 'Tricolor Calico',
      rawNotes: 'Manchinha preta no queixo, assustada com trovoada.',
    })

    expect(profile).toBeDefined()
    expect(profile.length).toBeGreaterThan(15)
    expect(profile).toContain('SRD')
  })

  it('provides preventive health advice with non-diagnostic disclaimer', async () => {
    const response = await aiService.getHealthAdvice('Como fazer meu gato beber mais água?')
    expect(response.advice).toBeDefined()
    expect(response.disclaimer).toBe(AI_SAFETY_DISCLAIMER)
  })
})
