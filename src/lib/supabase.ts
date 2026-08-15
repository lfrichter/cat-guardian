import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-supabase-project') &&
    !supabaseUrl.includes('placeholder-cat-guardian')
  )
}

/**
 * Singleton Supabase Client Instance.
 * Configured with safe fallback credentials if environment variables are unpopulated during development.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder-cat-guardian.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key-12345',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
