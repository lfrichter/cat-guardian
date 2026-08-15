export type HealthRecordType = 'vaccine' | 'allergy' | 'medication' | 'vet_visit' | 'weight'

export interface HealthRecord {
  id: string
  catId: string
  recordType: HealthRecordType
  title: string
  description?: string
  dateAdministered?: string
  nextDueDate?: string
  vetName?: string
  createdAt?: string
}

export type CreateHealthRecordInput = Omit<HealthRecord, 'id' | 'createdAt'>
