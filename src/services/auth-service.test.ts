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
    const owner = await authService.signIn('lucas@catguardian.dev', 'password123')
    expect(owner).toBeDefined()
    expect(owner.email).toBe('lucas@catguardian.dev')

    const current = await authService.getCurrentUser()
    expect(current?.email).toBe('lucas@catguardian.dev')
  })

  it('signs out user cleanly', async () => {
    await authService.signIn('lucas@catguardian.dev', 'password123')
    await authService.signOut()
    const current = await authService.getCurrentUser()
    expect(current).toBeNull()
  })
})
