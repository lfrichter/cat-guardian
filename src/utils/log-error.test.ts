import { describe, it, expect, vi } from 'vitest'
import { logClientError } from './log-error'

describe('logClientError Utility', () => {
  it('logs runtime error to console without throwing exception', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await expect(
      logClientError({
        error: new Error('Test runtime exception'),
        context: 'UnitTestContext',
        userEmail: 'test@catguardian.com',
      })
    ).resolves.not.toThrow()

    expect(consoleSpy).toHaveBeenCalledWith(
      '[CatGuardianError][UnitTestContext]',
      expect.objectContaining({
        message: 'Test runtime exception',
        userEmail: 'test@catguardian.com',
      })
    )

    consoleSpy.mockRestore()
  })
})
