import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Sighting, CreateSightingInput } from '@/types/lost'
import { logClientError } from '@/utils/log-error'

const LOCAL_STORAGE_SIGHTINGS_KEY = 'cat_guardian_sightings_v1'

function getLocalSightings(): Sighting[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_SIGHTINGS_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function setLocalSightings(sightings: Sighting[]): void {
  localStorage.setItem(LOCAL_STORAGE_SIGHTINGS_KEY, JSON.stringify(sightings))
}

export const lostService = {
  /**
   * TASK-141: Report a cat sighting by a finder.
   */
  async reportSighting(input: CreateSightingInput): Promise<Sighting> {
    const newSighting: Sighting = {
      ...input,
      id: `sighting-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from('sightings') as any)
          .insert({
            cat_id: input.catId,
            lost_incident_id: input.lostIncidentId,
            location: input.location,
            message: input.message,
            finder_name: input.finderName,
            finder_phone: input.finderPhone,
          })
          .select()
          .single()

        if (!error && data) {
          return {
            id: data.id,
            catId: data.cat_id,
            lostIncidentId: data.lost_incident_id || undefined,
            location: data.location,
            message: data.message || undefined,
            finderName: data.finder_name || undefined,
            finderPhone: data.finder_phone,
            createdAt: data.created_at,
          }
        }
      } catch (err) {
        logClientError({ error: err, context: 'lostService.reportSighting', metadata: { catId: input.catId } })
      }
    }

    const local = getLocalSightings()
    setLocalSightings([newSighting, ...local])
    return newSighting
  },

  /**
   * Fetch reported sightings for a cat (for the owner's dashboard).
   */
  async getSightingsForCat(catId: string): Promise<Sighting[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from('sightings') as any)
          .select('*')
          .eq('cat_id', catId)
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            catId: s.cat_id,
            lostIncidentId: s.lost_incident_id,
            location: s.location,
            message: s.message,
            finderName: s.finder_name,
            finderPhone: s.finder_phone,
            createdAt: s.created_at,
          }))
        }
      } catch (err) {
        logClientError({ error: err, context: 'lostService.getSightingsForCat', metadata: { catId } })
      }
    }

    const local = getLocalSightings()
    return local.filter((s) => s.catId === catId)
  },

  /**
   * TASK-142: Contact Relay intermediate proxy format URL.
   */
  generateContactRelayUrl(ownerPhone: string, catName: string): string {
    const cleanPhone = ownerPhone.replace(/\D/g, '')
    const defaultMsg = encodeURIComponent(`Olá! Encontrei seu gato ${catName} através da tag do Cat Guardian.`)
    return `https://wa.me/${cleanPhone}?text=${defaultMsg}`
  },
}
