export type HealthRecordType = 'vaccine' | 'allergy' | 'medication' | 'vet_visit' | 'weight'

export interface HealthRecord {
  id: string
  catId: string
  recordType: HealthRecordType
  title: string
  titleLocalized?: Record<string, string>
  description?: string
  descriptionLocalized?: Record<string, string>
  dateAdministered?: string
  nextDueDate?: string
  vetName?: string
  createdAt?: string
}

export type CreateHealthRecordInput = Omit<HealthRecord, 'id' | 'createdAt'>

export type HealthStatusLevel = 'UP_TO_DATE' | 'NEEDS_ATTENTION' | 'UNKNOWN'

export interface HealthStatusSummary {
  level: HealthStatusLevel
  label: string
  colorToken: string
}

export function computeHealthStatus(records: HealthRecord[]): HealthStatusSummary {
  const vaccineRecords = records.filter((r) => r.recordType === 'vaccine')
  if (vaccineRecords.length === 0) {
    return {
      level: 'UNKNOWN',
      label: '⚪ Unknown',
      colorToken: 'var(--color-text-muted)',
    }
  }

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const hasOverdueOrImpending = vaccineRecords.some((vr) => {
    if (!vr.nextDueDate) return false
    return vr.nextDueDate <= thirtyDaysFromNow
  })

  if (hasOverdueOrImpending) {
    return {
      level: 'NEEDS_ATTENTION',
      label: '🟡 Needs Attention / Booster',
      colorToken: 'var(--color-warning)',
    }
  }

  return {
    level: 'UP_TO_DATE',
    label: '🟢 Vaccination Up To Date',
    colorToken: 'var(--color-success)',
  }
}

export function getLocalizedHealthRecord(record: HealthRecord, currentLang = 'en'): { title: string; description?: string } {
  const title = (record.titleLocalized && (record.titleLocalized[currentLang] || record.titleLocalized['en'])) || record.title
  const description = (record.descriptionLocalized && (record.descriptionLocalized[currentLang] || record.descriptionLocalized['en'])) || record.description
  return { title, description }
}
