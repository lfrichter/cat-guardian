import { describe, it, expect, beforeEach } from 'vitest'
import { authService } from './auth-service'

describe('authService (Supabase Auth & Fallback)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null user when unauthenticated', async () => {
    const user = await authService.getCurrentUser()
    expect(user).toBeNull()
  })

  it('signs in user and stores session in local storage', async () => {
    const owner = await authService.loginAsDemoUser()
    expect(owner).toBeDefined()
    expect(owner.email).toBe('demo@catguardian.dev')

    const current = await authService.getCurrentUser()
    expect(current?.email).toBe('demo@catguardian.dev')
  })

  it('signs out user cleanly', async () => {
    await authService.loginAsDemoUser()
    await authService.signOut()
    const current = await authService.getCurrentUser()
    expect(current).toBeNull()
  })
})
