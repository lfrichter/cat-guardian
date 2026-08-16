import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cat, getLocalizedCatProfile, getLocalizedColorPattern, getLocalizedBreed } from '@/types/cat'
import { catService } from '@/services/cat-service'
import { lostService } from '@/services/lost-service'
import { AlertTriangle, ShieldCheck, Send, CheckCircle2, Sparkles, MessageSquare, MapPin, Loader2 } from 'lucide-react'

interface PublicCatPassportProps {
  catId: string
  onBackToApp?: () => void
}

export const PublicCatPassport: React.FC<PublicCatPassportProps> = ({ catId, onBackToApp }) => {
  const { t, i18n } = useTranslation()
  const [cat, setCat] = React.useState<Cat | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [finderName, setFinderName] = React.useState('')
  const [finderPhone, setFinderPhone] = React.useState('')
  const [locationText, setLocationText] = React.useState('')
  const [finderNotes, setFinderNotes] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [sightingSent, setSightingSent] = React.useState(false)

  React.useEffect(() => {
    catService.getCatById(catId).then((c) => {
      setCat(c)
      setLoading(false)
    })
  }, [catId])

  const handleReportSighting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!finderPhone || !locationText) return
    setSubmitting(true)

    try {
      await lostService.reportSighting({
        catId,
        location: locationText,
        message: finderNotes,
        finderName,
        finderPhone,
      })
      setSightingSent(true)
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationText(`GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`)
        },
        () => {
          setLocationText('GPS indisponível. Por favor informe o endereço manualmente.')
        }
      )
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1.5rem', color: 'var(--color-text-muted)' }}>
        Carregando Cartão de Segurança Felino...
      </div>
    )
  }

  if (!cat) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-panel">
        <h2 style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{t('publicPassport.catNotFound')}</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>O código escaneado não corresponde a um passaporte ativo.</p>
        {onBackToApp && (
          <button className="btn btn-primary" onClick={onBackToApp}>
            {t('publicPassport.backToDashboard')}
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header Banner */}
      {cat.isLost ? (
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-danger), #e11d48)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-glow-coral)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={28} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>{t('publicPassport.missingTitle')}</h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.5 }}>
            {t('publicPassport.missingSubtitle')}
          </p>
          {cat.lostNotes && (
            <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>{t('publicPassport.lastSeenNotes')}:</strong> {cat.lostNotes}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <ShieldCheck size={24} color="var(--color-success)" />
          <div>
            <strong style={{ color: 'var(--color-success)', display: 'block' }}>{t('publicPassport.publicCardTitle')}</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {t('publicPassport.publicCardSubtitle')}
            </span>
          </div>
        </div>
      )}

      {/* Cat Information Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <img
            src={cat.photoUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'}
            alt={cat.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              objectFit: 'cover',
              border: `3px solid ${cat.isLost ? 'var(--color-danger)' : 'var(--color-primary)'}`,
            }}
          />
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--color-text)' }}>{cat.name}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: '0.2rem 0' }}>
              {getLocalizedBreed(cat, i18n.language)} • {cat.gender === 'fêmea' ? t('catList.female') : t('catList.male')}
            </p>
            <p style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>
              {t('catList.coatLabel')}: {getLocalizedColorPattern(cat, i18n.language)}
            </p>
          </div>
        </div>

        {/* AI Safety Passport Summary */}
        {getLocalizedCatProfile(cat, i18n.language) && (
          <div className="ai-highlight-box" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
              <Sparkles size={18} />
              <strong style={{ fontSize: '0.95rem' }}>{t('passport.aiPassportSummary')}</strong>
            </div>
            <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {getLocalizedCatProfile(cat, i18n.language)}
            </p>
          </div>
        )}

        {/* STEP 1: CTA Button based on Lost vs Protected Status */}
        {sightingSent ? (
          <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '1.5rem', borderRadius: '14px', textAlign: 'center', color: 'var(--color-success)' }}>
            <CheckCircle2 size={42} style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{t('publicPassport.messageSent')}</h3>
          </div>
        ) : (
          <div>
            {!showForm && (
              <button
                className={cat.isLost ? 'btn btn-danger' : 'btn btn-primary'}
                onClick={() => setShowForm(true)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '1.1rem 1.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  borderRadius: '16px',
                  boxShadow: cat.isLost ? 'var(--shadow-glow-coral)' : 'var(--shadow-glow-lavender)',
                }}
              >
                {cat.isLost ? (
                  <>
                    <AlertTriangle size={22} /> {t('publicPassport.foundCatCta')}
                  </>
                ) : (
                  <>
                    <MessageSquare size={22} /> {t('publicPassport.sendMessageCta')}
                  </>
                )}
              </button>
            )}

            {/* STEP 2: Blind Relay Form UI */}
            {showForm && (
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '1.75rem',
                  borderRadius: '16px',
                  border: `1px solid ${cat.isLost ? 'rgba(251, 113, 133, 0.4)' : 'var(--glass-border)'}`,
                  marginTop: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} color={cat.isLost ? 'var(--color-danger)' : 'var(--color-primary)'} />
                    {t('publicPassport.blindRelayTitle')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {t('passport.cancel')}
                  </button>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {t('publicPassport.blindRelaySubtitle')}
                </p>

                <form onSubmit={handleReportSighting}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        {t('publicPassport.yourName')}
                      </label>
                      <input
                        type="text"
                        value={finderName}
                        onChange={(e) => setFinderName(e.target.value)}
                        placeholder="Ex: Maria"
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        {t('publicPassport.yourContact')}
                      </label>
                      <input
                        type="text"
                        required
                        value={finderPhone}
                        onChange={(e) => setFinderPhone(e.target.value)}
                        placeholder="(11) 99999-9999 / email"
                        style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {t('publicPassport.whereSeen')}
                      </label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        style={{ background: 'none', border: 'none', color: 'var(--color-info)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <MapPin size={12} /> {t('publicPassport.captureGps')}
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      placeholder="Ex: Rua Oscar Freire..."
                      style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      {t('publicPassport.notesMessage')}
                    </label>
                    <textarea
                      rows={3}
                      value={finderNotes}
                      onChange={(e) => setFinderNotes(e.target.value)}
                      placeholder="Ex: Está calmo..."
                      style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className={cat.isLost ? 'btn btn-danger' : 'btn btn-primary'}
                    disabled={submitting}
                    style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="spin" /> {t('publicPassport.sending')}
                      </>
                    ) : (
                      <>
                        <Send size={18} /> {t('publicPassport.sendToOwner')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {onBackToApp && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={onBackToApp}>
            {t('publicPassport.backToDashboard')}
          </button>
        </div>
      )}
    </div>
  )
}
