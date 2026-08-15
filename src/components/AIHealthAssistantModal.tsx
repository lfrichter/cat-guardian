import React from 'react'
import { Cat } from '@/types/cat'
import { aiService, AIHealthAssistantResponse } from '@/services/ai-service'
import { X, HeartPulse, Send, AlertCircle } from 'lucide-react'

interface AIHealthAssistantModalProps {
  cat?: Cat | null
  onClose: () => void
}

export const AIHealthAssistantModal: React.FC<AIHealthAssistantModalProps> = ({ cat, onClose }) => {
  const [question, setQuestion] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [response, setResponse] = React.useState<AIHealthAssistantResponse | null>(null)

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    try {
      const res = await aiService.getHealthAdvice(question, cat ? { name: cat.name, breed: cat.breed } : undefined)
      setResponse(res)
    } finally {
      setLoading(false)
    }
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
          maxWidth: '680px',
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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '0.65rem', borderRadius: '14px' }}>
            <HeartPulse size={24} color="var(--color-success)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}>Guardian AI Health</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Assistente Preventivo de Cuidados Felinos {cat ? `• ${cat.name}` : ''}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAsk} style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Qual a frequência correta para escovar o pelo? Como estimular hidratação?"
              style={{
                width: '100%',
                padding: '0.85rem 3.25rem 0.85rem 1rem',
                background: 'var(--color-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: 'var(--color-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={18} color="#0B1020" />
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            Consultando diretrizes de cuidados preventivos...
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <div>
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem', background: 'var(--color-surface)' }}>
              <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {response.advice}
              </p>
            </div>

            {/* Mandatory Disclaimer */}
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'flex-start',
              }}
            >
              <AlertCircle size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--color-warning)', margin: 0, lineHeight: 1.4 }}>
                {response.disclaimer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
