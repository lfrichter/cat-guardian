import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPTS, AI_SAFETY_DISCLAIMER } from './ai-prompts'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
const isGeminiConfigured = Boolean(apiKey) && !apiKey.includes('placeholder')

let genAI: GoogleGenerativeAI | null = null
if (isGeminiConfigured) {
  genAI = new GoogleGenerativeAI(apiKey)
}

export interface AIProfileGeneratorInput {
  name: string
  breed: string
  colorPattern: string
  gender: string
  rawNotes?: string
}

export interface AIHealthAssistantResponse {
  advice: string
  disclaimer: string
}

const CANDIDATE_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-flash']

export const aiService = {
  /**
   * Check if Gemini API Key is configured.
   */
  isConfigured(): boolean {
    return isGeminiConfigured
  },

  /**
   * TASK-013: Generate descriptive AI Safety Passport profile for a cat.
   */
  async generateCatProfile(input: AIProfileGeneratorInput): Promise<string> {
    const promptPayload = `
Gato: ${input.name}
Raça: ${input.breed}
Gênero: ${input.gender}
Pelagem/Padrão: ${input.colorPattern}
Anotações adicionais do tutor: ${input.rawNotes || 'Nenhuma nota adicional'}
`

    if (genAI) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPTS.CAT_PROFILE_GENERATOR,
          })

          const result = await model.generateContent(promptPayload)
          const responseText = result.response.text().trim()
          if (responseText) return responseText
        } catch {
          // Graceful fallback to next candidate model or local generator
        }
      }
    }

    // Local Fallback Generator for offline/hackathon mode
    const notesSummary = input.rawNotes ? ` ${input.rawNotes}` : ''
    return `Felino da raça ${input.breed} com pelagem ${input.colorPattern}. Apresenta padrão visual característico.${notesSummary}`
  },

  /**
   * TASK-014: AI Health & Preventive Care Assistant (Non-diagnostic).
   */
  async getHealthAdvice(question: string, catContext?: { name: string; breed: string; age?: string }): Promise<AIHealthAssistantResponse> {
    const contextPrompt = catContext
      ? `Pergunta sobre o felino ${catContext.name} (${catContext.breed}): ${question}`
      : `Dúvida de cuidados felinos: ${question}`

    if (genAI) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPTS.HEALTH_ASSISTANT,
          })

          const result = await model.generateContent(contextPrompt)
          const advice = result.response.text().trim()
          if (advice) {
            return {
              advice,
              disclaimer: AI_SAFETY_DISCLAIMER,
            }
          }
        } catch {
          // Graceful fallback
        }
      }
    }

    // Local Fallback response
    return {
      advice: `Para dúvidas preventivas sobre ${catContext ? catContext.name : 'seu gato'}, mantenha a vacinação em dia, água fresca em fontes circulantes e enriquecimento ambiental. Para qualquer alteração de comportamento ou apetite, consulte um veterinário.`,
      disclaimer: AI_SAFETY_DISCLAIMER,
    }
  },
}
