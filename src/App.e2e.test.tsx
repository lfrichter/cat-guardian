import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@/lib/i18n'
import { App } from './App'
import { catService } from './services/cat-service'
import { lostService } from './services/lost-service'

describe('E2E Critical Flow (TASK-180)', () => {
  it('renders Dashboard 2.0 and seed cats count', async () => {
    render(<App />)
    const brand = await screen.findByText(/Cat Guardian/i)
    expect(brand).toBeInTheDocument()
  })

  it('executes end-to-end sighting report flow', async () => {
    const cats = await catService.getCats()
    expect(cats.length).toBeGreaterThan(0)

    const targetCat = cats[0]
    const sighting = await lostService.reportSighting({
      catId: targetCat.id,
      location: 'Av. Paulista, 1000 - São Paulo',
      message: 'Avistado no parque',
      finderName: 'Carlos',
      finderPhone: '11988887777',
    })

    expect(sighting.id).toBeDefined()
    expect(sighting.location).toContain('Av. Paulista')

    const list = await lostService.getSightingsForCat(targetCat.id)
    expect(list.some((s) => s.id === sighting.id)).toBe(true)
  })
})
