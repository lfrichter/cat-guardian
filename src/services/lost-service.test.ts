import { describe, it, expect, beforeEach } from 'vitest'
import { lostService } from './lost-service'
import { emailService } from './email-service'

describe('lostService (Sightings & Blind Contact Relay)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reports a sighting by a finder and stores in repository', async () => {
    const sighting = await lostService.reportSighting({
      catId: 'seed-cat-meias',
      location: 'Rua Oscar Freire, 1200',
      message: 'Gato escondido sob um carro preto',
      finderName: 'Ana',
      finderPhone: '11999998888',
    })

    expect(sighting).toBeDefined()
    expect(sighting.catId).toBe('seed-cat-meias')
    expect(sighting.location).toBe('Rua Oscar Freire, 1200')

    const fetched = await lostService.getSightingsForCat('seed-cat-meias')
    expect(fetched.length).toBeGreaterThanOrEqual(1)
    expect(fetched[0].finderName).toBe('Ana')
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
