import React from 'react'
import { Cat } from '@/types/cat'
import { aiService } from '@/services/ai-service'
import { X, Sparkles, Check, RefreshCw } from 'lucide-react'

interface AIGeneratorModalProps {
  cat: Cat
  onClose: () => void
  onApplyProfile: (catId: string, aiSummary: string) => Promise<void>
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ cat, onClose, onApplyProfile }) => {
  const [rawNotes, setRawNotes] = React.useState(cat.lostNotes || '')
  const [generatedSummary, setGeneratedSummary] = React.useState(cat.aiProfileSummary || '')
  const [loading, setLoading] = React.useState(false)
  const [applied, setApplied] = React.useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const summary = await aiService.generateCatProfile({
        name: cat.name,
        breed: cat.breed,
        gender: cat.gender,
        colorPattern: cat.colorPattern,
        rawNotes,
      })
      setGeneratedSummary(summary)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!generatedSummary) return
    await onApplyProfile(cat.id, generatedSummary)
    setApplied(true)
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1050,
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
          maxWidth: '620px',
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
          <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-info))', padding: '0.65rem', borderRadius: '14px' }}>
            <Sparkles size={24} color="#0B1020" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}>Guardian AI Passport</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Gerador de Identificação Descritiva para {cat.name}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Anotações do Tutor (marcas únicas, sinais, comportamento)
          </label>
          <textarea
            rows={3}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Ex: Manchinha marrom na ponta da cauda, assusta fácil com trovão, miado rouco..."
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--color-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Gerando Perfil com IA...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Gerar Passaporte com IA
            </>
          )}
        </button>

        {generatedSummary && (
          <div className="ai-highlight-box" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resultado Gerado pela IA:
            </span>
            <p style={{ color: 'var(--color-text)', marginTop: '0.5rem', marginBottom: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {generatedSummary}
            </p>
          </div>
        )}

        {generatedSummary && (
          <button
            className="btn btn-primary"
            onClick={handleApply}
            disabled={applied}
            style={{ width: '100%', justifyContent: 'center', background: applied ? 'var(--color-success)' : undefined }}
          >
            {applied ? (
              <>
                <Check size={18} /> Salvo no Passaporte!
              </>
            ) : (
              'Aplicar ao Passaporte do Gato'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
