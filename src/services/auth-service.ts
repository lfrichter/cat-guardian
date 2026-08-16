import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { OwnerProfile } from '@/types/owner'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { logClientError } from '@/utils/log-error'

const LOCAL_STORAGE_MOCK_USER_KEY = 'cat_guardian_mock_user_v1'

export const authService = {
  /**
   * Fetch current authenticated user profile.
   */
  async getCurrentUser(): Promise<OwnerProfile | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          return mapSupabaseUserToOwner(user)
        }
      } catch {
        // User is not signed in
      }
    }

    // Local Storage Mock User Fallback
    const stored = localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  },

  /**
   * Sign in with Email and Password.
   */
  async signIn(email: string, password: string): Promise<OwnerProfile> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (!error && data.user) {
          const owner = mapSupabaseUserToOwner(data.user)
          localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(owner))
          return owner
        }
        if (error && !error.message.includes('FetchError') && !error.message.includes('Failed to fetch')) {
          logClientError({ error, context: 'authService.signIn' })
          throw error
        }
      } catch (err: any) {
        if (err.message && !err.message.includes('FetchError') && !err.message.includes('Failed to fetch')) {
          logClientError({ error: err, context: 'authService.signIn' })
          throw err
        }
      }
    }

    // Fallback ONLY when Supabase environment is NOT configured or offline test mode
    const mockUser: OwnerProfile = {
      id: `owner-${Date.now()}`,
      email,
      name: email.split('@')[0] || 'Tutor',
      phone: '+55 11 98888-7771',
    }
    localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(mockUser))
    return mockUser
  },

  /**
   * Sign Up new account.
   */
  async signUp(email: string, password: string, name: string, phone: string): Promise<OwnerProfile> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone },
          },
        })
        if (!error && data.user) {
          const owner = mapSupabaseUserToOwner(data.user, name, phone)
          localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(owner))
          return owner
        }
        if (error && !error.message.includes('FetchError') && !error.message.includes('Failed to fetch')) {
          logClientError({ error, context: 'authService.signUp' })
          throw error
        }
      } catch (err: any) {
        if (err.message && !err.message.includes('FetchError') && !err.message.includes('Failed to fetch')) {
          logClientError({ error: err, context: 'authService.signUp' })
          throw err
        }
      }
    }

    // Fallback ONLY when Supabase environment is NOT configured or offline test mode
    const mockUser: OwnerProfile = {
      id: `owner-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      phone: phone || '+55 11 98888-7771',
    }
    localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(mockUser))
    return mockUser
  },

  /**
   * TASK-202: Explore Demo Golden Path silent login for demonstration mode.
   */
  async loginAsDemoUser(): Promise<OwnerProfile> {
    const demoEmail = 'demo@catguardian.dev'
    const demoPassword = 'DemoGuardian2026!'

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        })

        if (error || !data.user) {
          // If sign in fails, attempt registration
          const signUpRes = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: { name: 'Demo Guardian Tutor', phone: '+55 11 98888-7771' },
            },
          })
          if (!signUpRes.error && signUpRes.data.user) {
            return mapSupabaseUserToOwner(signUpRes.data.user, 'Demo Guardian Tutor', '+55 11 98888-7771')
          }
        } else if (data.user) {
          return mapSupabaseUserToOwner(data.user, 'Demo Guardian Tutor', '+55 11 98888-7771')
        }
      } catch {
        // Fallback to local sandbox if Supabase Auth is unavailable
      }
    }

    const demoUser: OwnerProfile = {
      id: 'd3000000-0000-4000-a000-000000000001',
      email: demoEmail,
      name: 'Demo Guardian Tutor',
      phone: '+55 11 98888-7771',
    }
    localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(demoUser))
    return demoUser
  },

  /**
   * Sign Out.
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut()
      } catch {
        // Fallback cleanup
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY)
  },

  /**
   * Listen to Auth state changes.
   */
  onAuthStateChange(callback: (user: OwnerProfile | null) => void) {
    if (isSupabaseConfigured()) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
              callback(mapSupabaseUserToOwner(session.user))
            } else {
              callback(null)
            }
          }
        )
        return () => subscription.unsubscribe()
      } catch {
        return () => {}
      }
    }

    return () => {}
  },
}

function mapSupabaseUserToOwner(user: User, fallbackName?: string, fallbackPhone?: string): OwnerProfile {
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || fallbackName || user.email?.split('@')[0] || 'Tutor',
    phone: user.user_metadata?.phone || fallbackPhone || '',
    createdAt: user.created_at,
  }
}
