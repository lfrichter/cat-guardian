import { describe, it, expect, beforeEach } from 'vitest'
import { catService } from './cat-service'

describe('catService Repository & Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('fetches initial list of seed cats when local storage is empty', async () => {
    const cats = await catService.getCats()
    expect(cats.length).toBeGreaterThanOrEqual(7)
    expect(cats.some((c) => c.name === 'Kiara')).toBe(true)
    expect(cats.some((c) => c.name === 'Meias (Socks)')).toBe(true)
  })

  it('retrieves a single cat profile by ID', async () => {
    localStorage.setItem('cat_guardian_mock_user_v1', JSON.stringify({ id: 'owner-1', email: 'lucas@catguardian.dev' }))
    const kiara = await catService.getCatById('a100ca71-0000-4000-a000-000000000001')
    expect(kiara).not.toBeNull()
    expect(kiara?.name).toBe('Kiara')
    expect(kiara?.microchipNumber).toBe('982000341829012')
  })

  it('updates a cat profile and toggles lost status', async () => {
    const updated = await catService.updateCat('a100ca71-0000-4000-a000-000000000001', {
      isLost: true,
      lostNotes: 'Gata perdida perto do parque.',
    })
    expect(updated.isLost).toBe(true)
    expect(updated.lostNotes).toBe('Gata perdida perto do parque.')
  })
})
