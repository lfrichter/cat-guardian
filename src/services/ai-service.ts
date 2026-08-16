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
  language?: string
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
   * TASK-013 & TASK-201: Generate descriptive AI Safety Passport profile for a cat with language awareness.
   */
  async generateCatProfile(input: AIProfileGeneratorInput): Promise<string> {
    const lang = input.language || 'en'
    const langInstruction = lang === 'pt-BR' ? 'Responda estritamente em português do Brasil (pt-BR).' : 'Respond strictly in English.'

    const promptPayload = `
Language Instruction: ${langInstruction}
Cat Name: ${input.name}
Breed: ${input.breed}
Gender: ${input.gender}
Color/Pattern: ${input.colorPattern}
Additional Owner Notes: ${input.rawNotes || 'None'}
`

    if (genAI) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPTS.CAT_PROFILE_GENERATOR + ' ' + langInstruction,
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
    if (lang === 'pt-BR') {
      return `Felino da raça ${input.breed} com pelagem ${input.colorPattern}. Apresenta padrão visual característico.${notesSummary}`
    }
    return `Cat of breed ${input.breed} with coat pattern ${input.colorPattern}. Features distinctive visual appearance.${notesSummary}`
  },

  /**
   * TASK-014 & TASK-201: AI Health & Preventive Care Assistant (Non-diagnostic).
   */
  async getHealthAdvice(
    question: string,
    catContext?: { name: string; breed: string; age?: string },
    language = 'en'
  ): Promise<AIHealthAssistantResponse> {
    const langInstruction = language === 'pt-BR' ? 'Responda em português do Brasil.' : 'Respond in English.'
    const contextPrompt = catContext
      ? `(${langInstruction}) Question regarding cat ${catContext.name} (${catContext.breed}): ${question}`
      : `(${langInstruction}) Preventive cat care question: ${question}`

    if (genAI) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPTS.HEALTH_ASSISTANT + ' ' + langInstruction,
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
    if (language === 'pt-BR') {
      return {
        advice: `Para dúvidas preventivas sobre ${catContext ? catContext.name : 'seu gato'}, mantenha a vacinação em dia, água fresca em fontes circulantes e enriquecimento ambiental. Para qualquer alteração de comportamento ou apetite, consulte um veterinário.`,
        disclaimer: AI_SAFETY_DISCLAIMER,
      }
    }

    return {
      advice: `For preventive wellness questions about ${catContext ? catContext.name : 'your cat'}, keep vaccinations updated, provide fresh circulating water, and environmental enrichment. Consult a licensed veterinarian for behavioral changes.`,
      disclaimer: AI_SAFETY_DISCLAIMER,
    }
  },
}
