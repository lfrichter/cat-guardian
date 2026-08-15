import { describe, it, expect, beforeEach } from 'vitest'
import { lostService } from './lost-service'

describe('lostService (Sightings & Contact Relay)', () => {
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

  it('generates whatsapp contact relay URL', () => {
    const url = lostService.generateContactRelayUrl('+55 11 98888-7771', 'Meias')
    expect(url).toContain('wa.me/5511988887771')
    expect(url).toContain('Meias')
  })
})
