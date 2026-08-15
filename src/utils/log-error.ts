import { supabase } from '@/lib/supabase'

export interface LogClientErrorParams {
  error: unknown
  context?: string
  userEmail?: string
  metadata?: Record<string, unknown>
}

/**
 * Centralized client error logging utility.
 * Logs critical runtime errors to console and attempts persistence in Supabase `client_errors` table.
 */
export async function logClientError({
  error,
  context = 'General',
  userEmail,
  metadata = {},
}: LogClientErrorParams): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error(`[CatGuardianError][${context}]`, {
    message: errorMessage,
    userEmail,
    metadata,
    error,
  })

  try {
    if (supabase) {
      await (supabase.from('client_errors') as any).insert({
        context,
        error_message: errorMessage,
        error_stack: errorStack,
        user_email: userEmail || 'anonymous',
        metadata: metadata,
        created_at: new Date().toISOString(),
      })
    }
  } catch (logErr) {
    // Prevent recursive error logging loops
    console.warn('[logClientError] Failed to persist error to Supabase:', logErr)
  }
}
