import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Sighting, CreateSightingInput } from '@/types/lost'
import { emailService } from '@/services/email-service'
import { catService } from '@/services/cat-service'
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
   * TASK-141 & TASK-142: Report a cat sighting by a finder and send Blind Contact Relay email to owner.
   */
  async reportSighting(input: CreateSightingInput): Promise<Sighting> {
    const newSighting: Sighting = {
      ...input,
      id: `sighting-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // Trigger Blind Contact Relay Email Notification asynchronously
    catService.getCatById(input.catId).then((cat) => {
      if (cat) {
        emailService.sendSightingNotification({
          catName: cat.name,
          ownerEmail: cat.ownerEmail || 'catguardian213@gmail.com',
          finderName: input.finderName,
          finderPhone: input.finderPhone,
          location: input.location,
          message: input.message,
        })
      }
    })

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase as any).rpc('submit_sighting', {
          p_cat_id: input.catId,
          p_location: input.location,
          p_message: input.message || null,
          p_finder_name: input.finderName || null,
          p_finder_phone: input.finderPhone,
        })

        if (!error && data && data.success) {
          return {
            id: data.sighting_id || newSighting.id,
            catId: input.catId,
            lostIncidentId: input.lostIncidentId,
            location: input.location,
            message: input.message,
            finderName: input.finderName,
            finderPhone: input.finderPhone,
            createdAt: newSighting.createdAt,
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
}
