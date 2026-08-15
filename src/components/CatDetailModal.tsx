import React from 'react'
import { Cat } from '@/types/cat'
import { HealthRecord, HealthRecordType } from '@/types/health'
import { catService } from '@/services/cat-service'
import { X, ShieldCheck, AlertTriangle, HeartPulse, Phone, Mail, User, Plus, Sparkles } from 'lucide-react'

interface CatDetailModalProps {
  cat: Cat | null
  onClose: () => void
  onToggleLost: (cat: Cat) => void
}

export const CatDetailModal: React.FC<CatDetailModalProps> = ({ cat, onClose, onToggleLost }) => {
  const [healthRecords, setHealthRecords] = React.useState<HealthRecord[]>([])
  const [showAddRecord, setShowAddRecord] = React.useState(false)
  const [recordType, setRecordType] = React.useState<HealthRecordType>('vaccine')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [vetName, setVetName] = React.useState('')
  const [dateAdministered, setDateAdministered] = React.useState('')
  const [nextDueDate, setNextDueDate] = React.useState('')

  React.useEffect(() => {
    if (cat) {
      catService.getHealthRecords(cat.id).then(setHealthRecords)
    }
  }, [cat])

  if (!cat) return null

  const handleAddHealthRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    const created = await catService.addHealthRecord({
      catId: cat.id,
      recordType,
      title,
      description,
      vetName,
      dateAdministered: dateAdministered || undefined,
      nextDueDate: nextDueDate || undefined,
    })
    setHealthRecords([created, ...healthRecords])
    setTitle('')
    setDescription('')
    setVetName('')
    setShowAddRecord(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <img
            src={cat.photoUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'}
            alt={cat.name}
            style={{ width: '110px', height: '110px', borderRadius: '24px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{cat.name}</h2>
              <span className={cat.isLost ? 'badge badge-lost' : 'badge badge-safe'}>
                {cat.isLost ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
                {cat.isLost ? 'MODO PERDIDO ATIVO' : 'PROTEGIDO'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {cat.breed} • {cat.gender === 'fêmea' ? 'Fêmea' : 'Macho'} • {cat.colorPattern}
            </p>
            {cat.microchipNumber && (
              <p style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600' }}>
                Microchip ID: {cat.microchipNumber}
              </p>
            )}
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => onToggleLost(cat)}
            style={{ height: 'fit-content' }}
          >
            {cat.isLost ? 'Desativar Modo Perdido' : '⚠️ Declarar Desaparecido'}
          </button>
        </div>

        {/* AI Profile Section */}
        {cat.aiProfileSummary && (
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>
              <Sparkles size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Passaporte de Identificação IA</strong>
            </div>
            <p style={{ color: '#f3e8ff', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {cat.aiProfileSummary}
            </p>
          </div>
        )}

        {/* Tutor & Contact Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              <User size={15} /> Tutor Responsável
            </div>
            <strong>{cat.ownerName}</strong>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              <Phone size={15} /> Telefone de Contato
            </div>
            <strong>{cat.ownerPhone}</strong>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              <Mail size={15} /> E-mail
            </div>
            <strong>{cat.ownerEmail}</strong>
          </div>
        </div>

        {/* Health Passport Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <HeartPulse size={20} color="var(--accent-emerald)" /> Passaporte de Saúde & Vacinas
            </h3>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setShowAddRecord(!showAddRecord)}>
              <Plus size={16} /> Adicionar Registro
            </button>
          </div>

          {/* Add Health Record Form */}
          {showAddRecord && (
            <form onSubmit={handleAddHealthRecord} style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Novo Registro Médico</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Tipo de Registro</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value as HealthRecordType)}
                    style={{ width: '100%', padding: '0.6rem', background: '#11131f', border: '1px solid var(--border-glass)', color: '#fff', borderRadius: '8px' }}
                  >
                    <option value="vaccine">Vacina</option>
                    <option value="allergy">Alergia</option>
                    <option value="medication">Medicamento</option>
                    <option value="vet_visit">Consulta Veterinária</option>
                    <option value="weight">Controle de Peso</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Título / Vacina</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vacina V5 Quíntupla"
                    style={{ width: '100%', padding: '0.6rem', background: '#11131f', border: '1px solid var(--border-glass)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Veterinário / Clínica</label>
                <input
                  type="text"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                  placeholder="Ex: Dra. Amanda Silva - VetCare"
                  style={{ width: '100%', padding: '0.6rem', background: '#11131f', border: '1px solid var(--border-glass)', color: '#fff', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Data de Aplicação</label>
                  <input
                    type="date"
                    value={dateAdministered}
                    onChange={(e) => setDateAdministered(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#11131f', border: '1px solid var(--border-glass)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Próximo Reforço</label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: '#11131f', border: '1px solid var(--border-glass)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Salvar Registro no Passaporte
              </button>
            </form>
          )}

          {/* List of Health Records */}
          {healthRecords.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhum registro de vacina ou saúde cadastrado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {healthRecords.map((hr) => (
                <div
                  key={hr.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span className="badge badge-safe" style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                      {hr.recordType}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{hr.title}</h4>
                    {hr.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{hr.description}</p>}
                    {hr.vetName && <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>Vet: {hr.vetName}</p>}
                  </div>
                  {hr.dateAdministered && (
                    <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div>Aplicado: {hr.dateAdministered}</div>
                      {hr.nextDueDate && <div style={{ color: 'var(--accent-amber)', fontWeight: '600' }}>Reforço: {hr.nextDueDate}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
