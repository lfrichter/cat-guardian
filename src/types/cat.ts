export interface Cat {
  id: string
  name: string
  breed: string
  birthDate?: string
  gender: 'macho' | 'fêmea' | 'outro'
  colorPattern: string
  microchipNumber?: string
  isLost: boolean
  lostNotes?: string
  photoUrl?: string
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  ownerId?: string
  aiProfileSummary?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateCatInput = Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCatInput = Partial<CreateCatInput>
