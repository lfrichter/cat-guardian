import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Cat, CreateCatInput, UpdateCatInput } from '@/types/cat'
import { HealthRecord, CreateHealthRecordInput } from '@/types/health'
import { SEED_CATS, SEED_HEALTH_RECORDS } from '@/fixtures/cats-seed'
import { logClientError } from '@/utils/log-error'

const LOCAL_STORAGE_CATS_KEY = 'cat_guardian_cats_v1'
const LOCAL_STORAGE_HEALTH_KEY = 'cat_guardian_health_v1'

// Helper to map DB row to domain Cat model
function mapRowToCat(row: Record<string, any>): Cat {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed || 'SRD',
    birthDate: row.birth_date,
    gender: row.gender || 'macho',
    colorPattern: row.color_pattern || '',
    microchipNumber: row.microchip_number,
    isLost: Boolean(row.is_lost),
    lostNotes: row.lost_notes,
    photoUrl: row.photo_url,
    ownerName: row.owner_name || 'Tutor',
    ownerPhone: row.owner_phone || '',
    ownerEmail: row.owner_email || '',
    aiProfileSummary: row.ai_profile_summary,
    aiProfileLocalized: row.ai_profile_localized,
  }
}

export function sanitizeCatForPublicRescue(cat: Cat): Cat {
  return {
    ...cat,
    ownerEmail: undefined,
    ownerPhone: undefined,
    ownerName: undefined,
    microchipNumber: undefined,
  }
}

// Local Storage Fallback Helpers
function getLocalCats(): Cat[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_CATS_KEY)
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_CATS_KEY, JSON.stringify(SEED_CATS))
    return SEED_CATS
  }
  try {
    const parsed: Cat[] = JSON.parse(stored)
    return parsed.map((cat) => {
      const seed = SEED_CATS.find((s) => s.id === cat.id)
      if (seed) {
        return {
          ...cat,
          aiProfileLocalized: cat.aiProfileLocalized || seed.aiProfileLocalized,
          colorPatternLocalized: cat.colorPatternLocalized || seed.colorPatternLocalized,
        }
      }
      return cat
    })
  } catch {
    return SEED_CATS
  }
}

function setLocalCats(cats: Cat[]): void {
  localStorage.setItem(LOCAL_STORAGE_CATS_KEY, JSON.stringify(cats))
}

function getLocalHealthRecords(): HealthRecord[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_HEALTH_KEY)
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_HEALTH_KEY, JSON.stringify(SEED_HEALTH_RECORDS))
    return SEED_HEALTH_RECORDS
  }
  try {
    const parsed: HealthRecord[] = JSON.parse(stored)
    return parsed.map((record) => {
      const seed = SEED_HEALTH_RECORDS.find((s) => s.id === record.id)
      if (seed) {
        return {
          ...record,
          titleLocalized: record.titleLocalized || seed.titleLocalized,
          descriptionLocalized: record.descriptionLocalized || seed.descriptionLocalized,
        }
      }
      return record
    })
  } catch {
    return SEED_HEALTH_RECORDS
  }
}

export const catService = {
  /**
   * Fetch all registered cat profiles.
   */
  async getCats(): Promise<Cat[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .order('name', { ascending: true })

        if (!error && data && data.length > 0) {
          return data.map(mapRowToCat)
        }
      } catch (err) {
        logClientError({ error: err, context: 'catService.getCats' })
      }
    }
    return getLocalCats()
  },

  /**
   * Fetch a single cat profile by ID.
   */
  async getCatById(id: string): Promise<Cat | null> {
    if (isSupabaseConfigured()) {
      try {
        // First try fetching from owner-protected cats table (if user is authenticated)
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .eq('id', id)
          .single()

        if (!error && data) {
          return mapRowToCat(data)
        }

        // If owner query yields no results (e.g. unauthenticated public QR scan), query public_cat_profiles view
        try {
          const { data: publicData, error: publicError } = await (supabase as any)
            .from('public_cat_profiles')
            .select('*')
            .eq('id', id)
            .single()

          if (!publicError && publicData) {
            return sanitizeCatForPublicRescue(mapRowToCat(publicData))
          }
        } catch {
          // Public view query fallback for dev/test mock instances
        }
      } catch (err) {
        logClientError({ error: err, context: 'catService.getCatById', metadata: { id } })
      }
    }
    const cats = getLocalCats()
    const found =
      cats.find(
        (c) =>
          c.id === id ||
          (id === 'd3m0ca71-0000-0000-0000-000000000001' && c.id === 'seed-cat-kiara') ||
          (id === 'd3m0ca72-0000-0000-0000-000000000002' && c.id === 'seed-cat-golia') ||
          (id === 'd3m0ca73-0000-0000-0000-000000000003' && c.id === 'seed-cat-meias')
      ) || null

    if (found) {
      const mockUser = typeof window !== 'undefined' ? localStorage.getItem('cat_guardian_mock_user_v1') : null
      if (!mockUser) {
        return sanitizeCatForPublicRescue(found)
      }
    }
    return found
  },

  /**
   * Create a new cat profile.
   */
  async createCat(input: CreateCatInput): Promise<Cat> {
    const newId = `cat-${Date.now()}`
    const now = new Date().toISOString()
    const newCat: Cat = {
      ...input,
      id: newId,
      createdAt: now,
      updatedAt: now,
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from('cats') as any)
          .insert({
            name: input.name,
            breed: input.breed,
            birth_date: input.birthDate,
            gender: input.gender,
            color_pattern: input.colorPattern,
            microchip_number: input.microchipNumber,
            is_lost: input.isLost,
            lost_notes: input.lostNotes,
            photo_url: input.photoUrl,
            owner_name: input.ownerName,
            owner_phone: input.ownerPhone,
            owner_email: input.ownerEmail,
            ai_profile_summary: input.aiProfileSummary,
            ai_profile_localized: input.aiProfileLocalized,
          })
          .select()
          .single()

        if (!error && data) {
          return mapRowToCat(data)
        }
      } catch (err) {
        logClientError({ error: err, context: 'catService.createCat' })
      }
    }

    const local = getLocalCats()
    setLocalCats([newCat, ...local])
    return newCat
  },

  /**
   * Update an existing cat profile or toggle lost mode.
   */
  async updateCat(id: string, updates: UpdateCatInput): Promise<Cat> {
    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = { updated_at: new Date().toISOString() }
        if (updates.name !== undefined) payload.name = updates.name
        if (updates.breed !== undefined) payload.breed = updates.breed
        if (updates.birthDate !== undefined) payload.birth_date = updates.birthDate
        if (updates.gender !== undefined) payload.gender = updates.gender
        if (updates.colorPattern !== undefined) payload.color_pattern = updates.colorPattern
        if (updates.microchipNumber !== undefined) payload.microchip_number = updates.microchipNumber
        if (updates.isLost !== undefined) payload.is_lost = updates.isLost
        if (updates.lostNotes !== undefined) payload.lost_notes = updates.lostNotes
        if (updates.photoUrl !== undefined) payload.photo_url = updates.photoUrl
        if (updates.ownerName !== undefined) payload.owner_name = updates.ownerName
        if (updates.ownerPhone !== undefined) payload.owner_phone = updates.ownerPhone
        if (updates.ownerEmail !== undefined) payload.owner_email = updates.ownerEmail
        if (updates.aiProfileSummary !== undefined) payload.ai_profile_summary = updates.aiProfileSummary
        if (updates.aiProfileLocalized !== undefined) payload.ai_profile_localized = updates.aiProfileLocalized

        const { data, error } = await (supabase.from('cats') as any)
          .update(payload)
          .eq('id', id)
          .select()
          .single()

        if (!error && data) {
          return mapRowToCat(data)
        }
      } catch (err) {
        logClientError({ error: err, context: 'catService.updateCat', metadata: { id } })
      }
    }

    const local = getLocalCats()
    const updatedList = local.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    setLocalCats(updatedList)
    return updatedList.find((c) => c.id === id)!
  },

  /**
   * Fetch health records for a specific cat.
   */
  async getHealthRecords(catId: string): Promise<HealthRecord[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('cat_id', catId)
          .order('date_administered', { ascending: false })

        if (!error && data && data.length > 0) {
          return data.map((hr: any) => ({
            id: hr.id,
            catId: hr.cat_id,
            recordType: hr.record_type,
            title: hr.title,
            titleLocalized: hr.title_localized,
            description: hr.description,
            descriptionLocalized: hr.description_localized,
            dateAdministered: hr.date_administered,
            nextDueDate: hr.next_due_date,
            vetName: hr.vet_name,
            createdAt: hr.created_at,
          }))
        }
      } catch (err) {
        logClientError({ error: err, context: 'catService.getHealthRecords', metadata: { catId } })
      }
    }

    const allRecords = getLocalHealthRecords()
    return allRecords.filter((hr) => hr.catId === catId)
  },

  /**
   * Add a health record.
   */
  async addHealthRecord(input: CreateHealthRecordInput): Promise<HealthRecord> {
    const newRecord: HealthRecord = {
      ...input,
      id: `hr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from('health_records') as any)
          .insert({
            cat_id: input.catId,
            record_type: input.recordType,
            title: input.title,
            description: input.description,
            date_administered: input.dateAdministered,
            next_due_date: input.nextDueDate,
            vet_name: input.vetName,
          })
          .select()
          .single()

        if (!error && data) {
          return {
            id: data.id,
            catId: data.cat_id,
            recordType: data.record_type as any,
            title: data.title,
            description: data.description || undefined,
            dateAdministered: data.date_administered || undefined,
            nextDueDate: data.next_due_date || undefined,
            vetName: data.vet_name || undefined,
            createdAt: data.created_at,
          }
        }
      } catch (err) {
        logClientError({ error: err, context: 'catService.addHealthRecord' })
      }
    }

    const local = getLocalHealthRecords()
    localStorage.setItem(LOCAL_STORAGE_HEALTH_KEY, JSON.stringify([newRecord, ...local]))
    return newRecord
  },

  /**
   * Delete / Archive a cat profile.
   */
  async deleteCat(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await (supabase.from('cats') as any).delete().eq('id', id)
      } catch (err) {
        logClientError({ error: err, context: 'catService.deleteCat', metadata: { id } })
      }
    }

    const local = getLocalCats()
    setLocalCats(local.filter((c) => c.id !== id))
  },

  /**
   * Delete a health record.
   */
  async deleteHealthRecord(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await (supabase.from('health_records') as any).delete().eq('id', id)
      } catch (err) {
        logClientError({ error: err, context: 'catService.deleteHealthRecord', metadata: { id } })
      }
    }

    const local = getLocalHealthRecords()
    localStorage.setItem(LOCAL_STORAGE_HEALTH_KEY, JSON.stringify(local.filter((hr) => hr.id !== id)))
  },
}
