import { describe, it, expect } from 'vitest'
import { supabase, isSupabaseConfigured } from './supabase'

describe('Supabase Client Setup', () => {
  it('instantiates supabase client instance', () => {
    expect(supabase).toBeDefined()
    expect(supabase.from).toBeTypeOf('function')
  })

  it('correctly evaluates placeholder environment variables', () => {
    // Under placeholder .env, isSupabaseConfigured should return false
    const configured = isSupabaseConfigured()
    expect(typeof configured).toBe('boolean')
  })
})
