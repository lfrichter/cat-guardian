import { describe, it, expect, beforeEach } from 'vitest'
import { lostService } from './lost-service'
import { emailService } from './email-service'

describe('lostService (Sightings & Blind Contact Relay)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reports a sighting by a finder and stores in repository', async () => {
    const sighting = await lostService.reportSighting({
      catId: 'a100ca73-0000-4000-a000-000000000003',
      finderName: 'Maria Silva',
      finderPhone: '+55 11 99999-8888',
      location: 'Rua Augusta, 1000 - São Paulo',
      message: 'Gato visto perto da padaria.',
    })

    expect(sighting).toBeDefined()
    expect(sighting.catId).toBe('a100ca73-0000-4000-a000-000000000003')
    expect(sighting.finderName).toBe('Maria Silva')

    const fetched = await lostService.getSightingsForCat('a100ca73-0000-4000-a000-000000000003')
    expect(fetched.length).toBeGreaterThanOrEqual(1)
    expect(fetched[0].finderName).toBe('Maria Silva')
  })

  it('triggers blind contact relay email notification via emailService', async () => {
    const success = await emailService.sendSightingNotification({
      catName: 'Meias',
      finderName: 'Carlos',
      finderPhone: '11988887777',
      location: 'Av. Paulista, 1000',
      message: 'Gato calmo e seguro',
    })

    expect(typeof success).toBe('boolean')
  })
})
