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
      label: '⚪ Não Informado',
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
      label: '🟡 Requer Atenção / Reforço',
      colorToken: 'var(--color-warning)',
    }
  }

  return {
    level: 'UP_TO_DATE',
    label: '🟢 Vacinação Em Dia',
    colorToken: 'var(--color-success)',
  }
}
