import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cat, getLocalizedCatProfile, getLocalizedColorPattern, getLocalizedBreed } from '@/types/cat'
import { ShieldCheck, AlertTriangle, QrCode, Sparkles, HeartPulse, Lock } from 'lucide-react'

interface CatCardProps {
  cat: Cat
  isAuthenticated?: boolean
  onSelect: (cat: Cat) => void
  onToggleLost: (cat: Cat) => void
  onRequireAuth?: () => void
}

export const CatCard: React.FC<CatCardProps> = ({ cat, isAuthenticated, onSelect, onToggleLost, onRequireAuth }) => {
  const { t, i18n } = useTranslation()

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
        borderColor: cat.isLost ? 'rgba(251, 113, 133, 0.45)' : undefined,
        boxShadow: cat.isLost ? 'var(--shadow-glow-coral)' : undefined,
      }}
      onClick={() => onSelect(cat)}
    >
      {/* Top Banner / Status Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className={cat.isLost ? 'badge badge-lost' : 'badge badge-safe'}>
          {cat.isLost ? (
            <>
              <AlertTriangle size={13} /> {t('catList.lostMode')}
            </>
          ) : (
            <>
              <ShieldCheck size={13} /> {t('catList.protected')}
            </>
          )}
        </span>
        <button
          className="btn btn-secondary"
          style={{
            padding: '0.35rem 0.65rem',
            fontSize: '0.75rem',
            gap: '0.3rem',
            borderColor: cat.isLost ? 'rgba(251, 113, 133, 0.4)' : undefined,
            color: cat.isLost ? 'var(--color-danger)' : undefined,
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (!isAuthenticated && onRequireAuth) {
              onRequireAuth()
              return
            }
            onToggleLost(cat)
          }}
        >
          {isAuthenticated ? (
            cat.isLost ? t('catList.deactivateAlert') : t('catList.declareLost')
          ) : (
            <>
              <Lock size={12} /> {t('catList.changeStatus')}
            </>
          )}
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
            border: `2px solid ${cat.isLost ? 'var(--color-danger)' : 'var(--glass-border)'}`,
          }}
        />
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, color: 'var(--color-text)' }}>{cat.name}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {getLocalizedBreed(cat, i18n.language)} • {cat.gender === 'fêmea' ? t('catList.female') : t('catList.male')}
          </p>
          {cat.microchipNumber && (
            <p style={{ color: 'var(--color-primary)', fontSize: '0.75rem', margin: '0.2rem 0 0 0', fontWeight: '600' }}>
              Microchip: {cat.microchipNumber}
            </p>
          )}
        </div>
      </div>

      {/* Color Pattern */}
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem', flexGrow: 1 }}>
        {getLocalizedColorPattern(cat, i18n.language)}
      </p>

      {/* AI Summary Banner */}
      {getLocalizedCatProfile(cat, i18n.language) && (
        <div
          className="ai-highlight-box"
          style={{
            padding: '0.65rem 0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.4 }}>
            {getLocalizedCatProfile(cat, i18n.language)}
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--glass-border)',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
          <HeartPulse size={15} color="var(--color-success)" /> {t('catList.viewPassport')}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: 'var(--color-info)', display: 'flex', alignItems: 'center' }}>
            <QrCode size={18} />
          </span>
        </div>
      </div>
    </div>
  )
}
