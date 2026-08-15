import React from 'react'
import { Cat } from '@/types/cat'
import { OwnerProfile } from '@/types/owner'
import { HealthRecord, HealthRecordType, computeHealthStatus } from '@/types/health'
import { catService } from '@/services/cat-service'
import { QRCodeTag } from './QRCodeTag'
import { X, ShieldCheck, AlertTriangle, HeartPulse, Plus, Sparkles, QrCode, Edit3, Trash2, Lock, User, Phone, Mail } from 'lucide-react'

interface CatDetailModalProps {
  cat: Cat | null
  currentUser: OwnerProfile | null
  onClose: () => void
  onToggleLost: (cat: Cat) => void
  onEditCat?: (cat: Cat) => void
  onRequireAuth: () => void
}

export const CatDetailModal: React.FC<CatDetailModalProps> = ({
  cat,
  currentUser,
  onClose,
  onToggleLost,
  onEditCat,
  onRequireAuth,
}) => {
  const [healthRecords, setHealthRecords] = React.useState<HealthRecord[]>([])
  const [showAddRecord, setShowAddRecord] = React.useState(false)
  const [showQRTag, setShowQRTag] = React.useState(false)
  const [recordType, setRecordType] = React.useState<HealthRecordType>('vaccine')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [vetName, setVetName] = React.useState('')
  const [dateAdministered, setDateAdministered] = React.useState('')
  const [nextDueDate, setNextDueDate] = React.useState('')

  const isOwner = Boolean(currentUser && (!cat?.ownerId || cat?.ownerId === currentUser.id))

  React.useEffect(() => {
    if (cat) {
      catService.getHealthRecords(cat.id).then(setHealthRecords)
    }
  }, [cat])

  if (!cat) return null

  const healthSummary = computeHealthStatus(healthRecords)

  const handleAction = (actionFn: () => void) => {
    if (!currentUser) {
      onRequireAuth()
      return
    }
    actionFn()
  }

  const handleAddHealthRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !currentUser) return
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

  const handleDeleteRecord = async (id: string) => {
    if (!currentUser) {
      onRequireAuth()
      return
    }
    await catService.deleteHealthRecord(id)
    setHealthRecords((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(12px)',
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
          borderColor: cat.isLost ? 'rgba(251, 113, 133, 0.4)' : undefined,
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
            color: 'var(--color-text-muted)',
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
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '24px',
              objectFit: 'cover',
              border: `2px solid ${cat.isLost ? 'var(--color-danger)' : 'var(--glass-border)'}`,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-text)' }}>{cat.name}</h2>
              <span className={cat.isLost ? 'badge badge-lost' : 'badge badge-safe'}>
                {cat.isLost ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
                {cat.isLost ? 'MODO PERDIDO ATIVO' : 'PROTEGIDO'}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: healthSummary.colorToken }}>
                {healthSummary.label}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              {cat.breed} • {cat.gender === 'fêmea' ? 'Fêmea' : 'Macho'} • {cat.colorPattern}
            </p>
            {cat.microchipNumber && (
              <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600' }}>
                Microchip ID: {cat.microchipNumber}
              </p>
            )}
          </div>

          {/* Action Buttons with Strict Auth Protection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {onEditCat && (
              <button
                className="btn btn-secondary"
                onClick={() => handleAction(() => { onClose(); onEditCat(cat); })}
                style={{ fontSize: '0.85rem' }}
              >
                {currentUser ? <Edit3 size={16} /> : <Lock size={16} color="var(--color-warning)" />} Editar Perfil
              </button>
            )}
            <button
              className={cat.isLost ? 'btn btn-secondary' : 'btn btn-danger'}
              onClick={() => handleAction(() => onToggleLost(cat))}
            >
              {currentUser ? (
                cat.isLost ? 'Desativar Modo Perdido' : '⚠️ Declarar Desaparecido'
              ) : (
                '🔒 Entrar para Declarar Perdido'
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowQRTag(!showQRTag)}
              style={{ fontSize: '0.85rem' }}
            >
              <QrCode size={16} color="var(--color-info)" /> {showQRTag ? 'Ocultar Tag QR' : 'Ver Tag de Coleira'}
            </button>
          </div>
        </div>

        {/* QR Code Tag View */}
        {showQRTag && (
          <div style={{ marginBottom: '2rem' }}>
            <QRCodeTag cat={cat} />
          </div>
        )}

        {/* AI Profile Section */}
        {cat.aiProfileSummary && (
          <div className="ai-highlight-box" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
              <Sparkles size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Passaporte de Identificação IA</strong>
            </div>
            <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {cat.aiProfileSummary}
            </p>
          </div>
        )}

        {/* Tutor & Contact Info - Rendered ONLY if Tutor is Logged In */}
        {isOwner ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                <User size={15} /> Tutor Responsável
              </div>
              <strong style={{ color: 'var(--color-text)' }}>{cat.ownerName}</strong>
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                <Phone size={15} /> Telefone de Contato
              </div>
              <strong style={{ color: 'var(--color-text)' }}>{cat.ownerPhone}</strong>
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                <Mail size={15} /> E-mail
              </div>
              <strong style={{ color: 'var(--color-text)' }}>{cat.ownerEmail}</strong>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed var(--glass-border)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <Lock size={18} color="var(--color-warning)" style={{ marginBottom: '0.3rem' }} />
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Dados de contato do tutor protegidos. Faça login para gerenciar este passaporte.
            </p>
          </div>
        )}

        {/* Health Passport Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--color-text)' }}>
              <HeartPulse size={20} color="var(--color-success)" /> Passaporte de Saúde & Vacinas
            </h3>
            {currentUser && (
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setShowAddRecord(!showAddRecord)}>
                <Plus size={16} /> Adicionar Registro
              </button>
            )}
          </div>

          {/* Add Health Record Form */}
          {showAddRecord && currentUser && (
            <form onSubmit={handleAddHealthRecord} style={{ background: 'var(--color-surface)', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--color-text)' }}>Novo Registro Médico</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Tipo de Registro</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value as HealthRecordType)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                  >
                    <option value="vaccine">Vacina</option>
                    <option value="allergy">Alergia</option>
                    <option value="medication">Medicamento</option>
                    <option value="vet_visit">Consulta Veterinária</option>
                    <option value="weight">Controle de Peso</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Título / Vacina</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vacina V5 Quíntupla"
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Veterinário / Clínica</label>
                <input
                  type="text"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                  placeholder="Ex: Dra. Amanda Silva - VetCare"
                  style={{ width: '100%', padding: '0.6rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Data de Aplicação</label>
                  <input
                    type="date"
                    value={dateAdministered}
                    onChange={(e) => setDateAdministered(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Próximo Reforço</label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
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
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Nenhum registro de vacina ou saúde cadastrado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {healthRecords.map((hr) => (
                <div
                  key={hr.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--glass-border)',
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
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text)' }}>{hr.title}</h4>
                    {hr.description && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{hr.description}</p>}
                    {hr.vetName && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>Vet: {hr.vetName}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {hr.dateAdministered && (
                      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        <div>Aplicado: {hr.dateAdministered}</div>
                        {hr.nextDueDate && <div style={{ color: 'var(--color-warning)', fontWeight: '600' }}>Reforço: {hr.nextDueDate}</div>}
                      </div>
                    )}
                    {currentUser && (
                      <button
                        onClick={() => handleDeleteRecord(hr.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', opacity: 0.8 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
