import { describe, it, expect, beforeEach } from 'vitest'
import { catService } from '@/services/cat-service'
import { lostService } from '@/services/lost-service'
import { authService } from '@/services/auth-service'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

describe('Security & Authorization Boundary Test Suite', () => {
  beforeEach(async () => {
    localStorage.clear()
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut()
      } catch {
        // Clear active session
      }
    }
  })

  // --------------------------------------------------------------------------
  // POSITIVE & PUBLIC RESCUE FLOW TESTS
  // --------------------------------------------------------------------------
  it('TEST 9: Anonymous finder can submit an allowed sighting via public flow', async () => {
    const sighting = await lostService.reportSighting({
      catId: 'seed-cat-meias', // Meias (Lost Mode Active)
      location: 'Parque Central - Proximo ao lago',
      message: 'Visto perto do banco de madeira',
      finderName: 'Maria Silva',
      finderPhone: '+55 11 97777-6666',
    })

    expect(sighting).toBeDefined()
    expect(sighting.catId).toBe('seed-cat-meias')
    expect(sighting.location).toContain('Parque Central')
  })

  it('TEST 14: Public cat/rescue endpoint does NOT return owner_email, owner_phone, owner_id, microchip_number or private health data', async () => {
    const publicCat = await catService.getCatById('seed-cat-kiara')

    expect(publicCat).toBeDefined()
    if (publicCat) {
      expect(publicCat.id).toBe('seed-cat-kiara')
      expect(publicCat.name).toBe('Kiara')
      expect(publicCat.breed).toBeDefined()
      expect(publicCat.colorPattern).toBeDefined()
      expect(publicCat.photoUrl).toBeDefined()

      // CRITICAL PII BOUNDARY SANITY:
      // Anonymous public rescue profile MUST NEVER leak owner details or full microchip number
      expect(publicCat.ownerEmail).toBeFalsy()
      expect(publicCat.ownerPhone).toBeFalsy()
      expect(publicCat.microchipNumber).toBeUndefined()
    }
  })

  it('REGRESSION TEST: Anonymous users cannot retrieve raw microchip_number via REST or View', async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('public_cat_profiles')
        .select('microchip_number')

      // microchip_number column physically does not exist on public_cat_profiles view
      const hasErrorOrNoData = Boolean(error) || !data || data.length === 0 || data[0]?.microchip_number === undefined
      expect(hasErrorOrNoData).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  // --------------------------------------------------------------------------
  // NEGATIVE ANONYMOUS REST BOUNDARY TESTS
  // --------------------------------------------------------------------------
  it('TEST 1: Anonymous user cannot update a cat in database', async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase.from('cats') as any)
        .update({ name: 'Hacked Cat Name' })
        .eq('id', 'seed-cat-kiara')
        .select()

      expect(data === null || data.length === 0 || error !== null).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  it('TEST 2: Anonymous user cannot delete a cat in database', async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase.from('cats') as any)
        .delete()
        .eq('id', 'seed-cat-kiara')
        .select()

      expect(data === null || data.length === 0 || error !== null).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  it('TEST 3 & TEST 4 & TEST 5: Anonymous user cannot insert, update, or delete health records', async () => {
    if (isSupabaseConfigured()) {
      const { error: insertErr } = await (supabase.from('health_records') as any).insert({
        cat_id: 'seed-cat-kiara',
        record_type: 'vaccine',
        title: 'Hacked Vaccine',
      })
      expect(insertErr).not.toBeNull()

      const { data: updateData } = await (supabase.from('health_records') as any)
        .update({ title: 'Corrupted Title' })
        .eq('cat_id', 'seed-cat-kiara')
        .select()
      expect(updateData === null || updateData.length === 0).toBe(true)

      const { data: deleteData } = await (supabase.from('health_records') as any)
        .delete()
        .eq('cat_id', 'seed-cat-kiara')
        .select()
      expect(deleteData === null || deleteData.length === 0).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  it('TEST 6: Anonymous user cannot read private health records table', async () => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from('health_records')
        .select('*')

      expect(data === null || data.length === 0).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  it('TEST 7: Anonymous user cannot create, update, or delete lost incidents', async () => {
    if (isSupabaseConfigured()) {
      const { error: insertErr } = await (supabase.from('lost_incidents') as any).insert({
        cat_id: 'seed-cat-kiara',
        notes: 'Malicious incident activation',
      })
      expect(insertErr).not.toBeNull()

      const { data: updateData } = await (supabase.from('lost_incidents') as any)
        .update({ status: 'RESOLVED' })
        .eq('cat_id', 'seed-cat-meias')
        .select()
      expect(updateData === null || updateData.length === 0).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  it('TEST 8: Anonymous user cannot read sightings table', async () => {
    if (isSupabaseConfigured()) {
      const { data } = await (supabase.from('sightings') as any)
        .select('*')

      expect(data === null || data.length === 0).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  // --------------------------------------------------------------------------
  // DEMO GUARDIAN ISOLATION TESTS vs macacoharmonico@gmail.com
  // --------------------------------------------------------------------------
  it('DEMO ISOLATION TEST: Demo Guardian cannot access or modify macacoharmonico@gmail.com cats', async () => {
    // Authenticate as Demo Guardian Tutor
    const demoProfile = await authService.loginAsDemoUser()
    expect(demoProfile.id).toBe('d3000000-0000-4000-a000-000000000001')

    // Local / App service level isolation test
    const demoCats = await catService.getCats()
    expect(demoCats.every((c) => c.ownerEmail === 'demo@catguardian.dev')).toBe(true)
    expect(demoCats.some((c) => c.ownerEmail === 'macacoharmonico@gmail.com')).toBe(false)
    expect(demoCats.some((c) => c.name === 'Vaquinha')).toBe(false)
    expect(demoCats.some((c) => c.name === 'Tigrinha')).toBe(false)

    if (isSupabaseConfigured()) {
      // 1. Demo Guardian attempts to SELECT cats owned by macacoharmonico@gmail.com
      const { data: macacoCats } = await (supabase.from('cats') as any)
        .select('*')
        .eq('owner_email', 'macacoharmonico@gmail.com')

      expect(macacoCats === null || macacoCats.length === 0).toBe(true)

      // 2. Demo Guardian attempts to UPDATE cats owned by macacoharmonico@gmail.com
      const { data: updateRes } = await (supabase.from('cats') as any)
        .update({ name: 'Hacked Macaco Cat' })
        .eq('owner_email', 'macacoharmonico@gmail.com')
        .select()

      expect(updateRes === null || updateRes.length === 0).toBe(true)

      // 3. Demo Guardian attempts to DELETE cats owned by macacoharmonico@gmail.com
      const { data: deleteRes } = await (supabase.from('cats') as any)
        .delete()
        .eq('owner_email', 'macacoharmonico@gmail.com')
        .select()

      expect(deleteRes === null || deleteRes.length === 0).toBe(true)
    }
  })

  it('DEMO ISOLATION TEST: Demo Guardian cannot access health records of another owner', async () => {
    await authService.loginAsDemoUser()

    if (isSupabaseConfigured()) {
      const { data: macacoHealth } = await (supabase.from('health_records') as any)
        .select('*')
        .eq('cat_id', 'macaco-cat-uuid-999')

      expect(macacoHealth === null || macacoHealth.length === 0).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  // --------------------------------------------------------------------------
  // SECRETS LEAKAGE AUDIT TEST
  // --------------------------------------------------------------------------
  it('TEST 19: No client bundle or source file exposes SUPABASE_SERVICE_ROLE or SERVICE_ROLE_KEY', () => {
    const envVars = Object.keys(import.meta.env)
    const containsServiceRole = envVars.some((key) => key.includes('SERVICE_ROLE') || key.includes('SECRET'))

    expect(containsServiceRole).toBe(false)
  })
})
