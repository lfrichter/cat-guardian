export interface LostIncident {
  id: string
  catId: string
  startedAt: string
  lastSeenAt?: string
  lastSeenLocation?: string
  notes?: string
  status: 'ACTIVE' | 'RESOLVED'
  resolvedAt?: string
}

export interface Sighting {
  id: string
  lostIncidentId?: string
  catId: string
  location: string
  message?: string
  finderName?: string
  finderPhone: string
  createdAt: string
}

export type CreateSightingInput = Omit<Sighting, 'id' | 'createdAt'>
