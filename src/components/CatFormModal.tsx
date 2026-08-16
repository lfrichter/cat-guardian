import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cat, CreateCatInput, UpdateCatInput } from '@/types/cat'
import { X, Cat as CatIcon, Sparkles, Trash2 } from 'lucide-react'

interface CatFormModalProps {
  catToEdit?: Cat | null
  onClose: () => void
  onSave: (catInput: CreateCatInput | UpdateCatInput, id?: string) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export const CatFormModal: React.FC<CatFormModalProps> = ({ catToEdit, onClose, onSave, onDelete }) => {
  const { t } = useTranslation()
  const isEditing = Boolean(catToEdit)
  const [name, setName] = React.useState(catToEdit?.name || '')
  const [breed, setBreed] = React.useState(catToEdit?.breed || 'SRD')
  const [gender, setGender] = React.useState<'macho' | 'fêmea' | 'outro'>(catToEdit?.gender || 'fêmea')
  const [colorPattern, setColorPattern] = React.useState(catToEdit?.colorPattern || '')
  const [microchipNumber, setMicrochipNumber] = React.useState(catToEdit?.microchipNumber || '')
  const [photoUrl, setPhotoUrl] = React.useState(catToEdit?.photoUrl || '')
  const [rawNotes, setRawNotes] = React.useState(catToEdit?.aiProfileSummary || '')
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !colorPattern) return

    if (isEditing && catToEdit) {
      await onSave(
        {
          name,
          breed,
          gender,
          colorPattern,
          microchipNumber: microchipNumber || undefined,
          photoUrl: photoUrl || undefined,
          aiProfileSummary: rawNotes || undefined,
        },
        catToEdit.id
      )
    } else {
      await onSave({
        name,
        breed,
        gender,
        colorPattern,
        microchipNumber: microchipNumber || undefined,
        isLost: false,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        ownerName: 'Tutor',
        ownerPhone: '+55 11 98888-7771',
        ownerEmail: 'lucas@catguardian.dev',
        aiProfileSummary: rawNotes ? `Perfil preliminar: ${rawNotes}` : undefined,
      })
    }
    onClose()
  }

  const handleDelete = async () => {
    if (catToEdit && onDelete) {
      await onDelete(catToEdit.id)
      onClose()
    }
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
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
        }}
      >
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--color-primary)', padding: '0.6rem', borderRadius: '12px' }}>
            <CatIcon size={24} color="#0B1020" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}>
              {isEditing ? `${t('catForm.editTitle')} ${catToEdit?.name}` : t('catForm.createTitle')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              {isEditing ? t('catForm.editSubtitle') : t('catForm.createSubtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                {t('catForm.catNameLabel')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('catForm.placeholderName')}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                {t('catForm.breedLabel')}
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder={t('catForm.placeholderBreed')}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                {t('catForm.genderLabel')}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'macho' | 'fêmea' | 'outro')}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
              >
                <option value="fêmea">{t('catList.female')}</option>
                <option value="macho">{t('catList.male')}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                {t('catForm.microchipLabel')}
              </label>
              <input
                type="text"
                value={microchipNumber}
                onChange={(e) => setMicrochipNumber(e.target.value)}
                placeholder={t('catForm.placeholderMicrochip')}
                style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              {t('catForm.colorPatternLabel')}
            </label>
            <input
              type="text"
              required
              value={colorPattern}
              onChange={(e) => setColorPattern(e.target.value)}
              placeholder={t('catForm.placeholderColorPattern')}
              style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              {t('catForm.photoUrlLabel')}
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
            />
          </div>

          <div className="ai-highlight-box" style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '12px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', fontWeight: '600' }}>
              <Sparkles size={16} /> {t('catForm.aiNotesLabel')}
            </label>
            <textarea
              rows={2}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder={t('catForm.placeholderAiNotes')}
              style={{ width: '100%', padding: '0.6rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}>
              {isEditing ? t('catForm.saveChanges') : t('catForm.registerCat')}
            </button>

            {isEditing && onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowConfirmDelete(!showConfirmDelete)}
                style={{ padding: '0.85rem' }}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {showConfirmDelete && (
            <div
              style={{
                marginTop: '1rem',
                background: 'rgba(251, 113, 133, 0.15)',
                border: '1px solid rgba(251, 113, 133, 0.4)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--color-danger)', margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: '600' }}>
                {t('catForm.confirmDelete')}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button type="button" className="btn btn-danger" onClick={handleDelete} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  {t('catForm.yesDelete')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmDelete(false)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  {t('catForm.cancel')}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
