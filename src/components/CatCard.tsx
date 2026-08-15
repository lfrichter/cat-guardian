import React from 'react'
import { Cat } from '@/types/cat'
import { ShieldCheck, AlertTriangle, QrCode, Sparkles, HeartPulse } from 'lucide-react'

interface CatCardProps {
  cat: Cat
  onSelect: (cat: Cat) => void
  onToggleLost: (cat: Cat) => void
}

export const CatCard: React.FC<CatCardProps> = ({ cat, onSelect, onToggleLost }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'pointer',
        border: cat.isLost ? '1px solid rgba(255, 64, 129, 0.4)' : undefined,
      }}
      onClick={() => onSelect(cat)}
    >
      {/* Top Banner / Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className={cat.isLost ? 'badge badge-lost' : 'badge badge-safe'}>
          {cat.isLost ? (
            <>
              <AlertTriangle size={13} /> MODO PERDIDO ATIVO
            </>
          ) : (
            <>
              <ShieldCheck size={13} /> SEGURA
            </>
          )}
        </span>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', gap: '0.3rem' }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleLost(cat)
          }}
        >
          {cat.isLost ? 'Desativar Alerta' : 'Declarar Perdido'}
        </button>
      </div>

      {/* Cat Avatar & Header Info */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <img
          src={cat.photoUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'}
          alt={cat.name}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--border-glass)',
          }}
        />
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{cat.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {cat.breed} • {cat.gender === 'fêmea' ? 'Fêmea' : 'Macho'}
          </p>
          {cat.microchipNumber && (
            <p style={{ color: 'var(--accent-amber)', fontSize: '0.75rem', margin: '0.2rem 0 0 0', fontWeight: '600' }}>
              Microchip: {cat.microchipNumber}
            </p>
          )}
        </div>
      </div>

      {/* Color Pattern & Traits */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', flexGrow: 1 }}>
        {cat.colorPattern}
      </p>

      {/* AI Summary Banner if present */}
      {cat.aiProfileSummary && (
        <div
          style={{
            background: 'rgba(168, 85, 247, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '10px',
            padding: '0.6rem 0.8rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={16} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.78rem', color: '#e9d5ff', margin: 0, lineHeight: 1.4 }}>
            {cat.aiProfileSummary}
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <HeartPulse size={14} color="var(--accent-emerald)" /> Ver Passaporte
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center' }}>
            <QrCode size={18} />
          </span>
        </div>
      </div>
    </div>
  )
}
