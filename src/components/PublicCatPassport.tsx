import React from 'react'
import { Cat } from '@/types/cat'
import { catService } from '@/services/cat-service'
import { lostService } from '@/services/lost-service'
import { AlertTriangle, ShieldCheck, Phone, Mail, MapPin, Send, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react'

interface PublicCatPassportProps {
  catId: string
  onBackToApp?: () => void
}

export const PublicCatPassport: React.FC<PublicCatPassportProps> = ({ catId, onBackToApp }) => {
  const [cat, setCat] = React.useState<Cat | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [finderName, setFinderName] = React.useState('')
  const [finderPhone, setFinderPhone] = React.useState('')
  const [locationText, setLocationText] = React.useState('')
  const [finderNotes, setFinderNotes] = React.useState('')
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

    await lostService.reportSighting({
      catId,
      location: locationText,
      message: finderNotes,
      finderName,
      finderPhone,
    })

    setSightingSent(true)
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationText(`GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`)
        },
        () => {
          setLocationText('GPS indisponível, informe a rua/bairro manualmente.')
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
        <h2 style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>Gato Não Encontrado</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>O código escaneado não corresponde a um passaporte ativo.</p>
        {onBackToApp && (
          <button className="btn btn-primary" onClick={onBackToApp}>
            Ir para o Painel Cat Guardian
          </button>
        )}
      </div>
    )
  }

  const whatsappUrl = lostService.generateContactRelayUrl(cat.ownerPhone, cat.name)

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Lost Mode Emergency Banner if Missing */}
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
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0 }}>GATO DECLARADO DESAPARECIDO</h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.5 }}>
            Por favor, ajude este felino a voltar para casa! Se você o encontrou ou viu, entre em contato com o tutor através do botão de emergência abaixo.
          </p>
          {cat.lostNotes && (
            <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>Último Local Visto / Nota:</strong> {cat.lostNotes}
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
            <strong style={{ color: 'var(--color-success)', display: 'block' }}>Cartão de Segurança Público</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Perfil verificado na rede de proteção Cat Guardian.</span>
          </div>
        </div>
      )}

      {/* Main Public Passport Card (Privacy Preserved) */}
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
              {cat.breed} • {cat.gender === 'fêmea' ? 'Fêmea' : 'Macho'}
            </p>
            <p style={{ color: 'var(--color-text)', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>
              Pelagem: {cat.colorPattern}
            </p>
            {cat.microchipNumber && (
              <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: '600' }}>
                Microchip ID: {cat.microchipNumber}
              </p>
            )}
          </div>
        </div>

        {/* AI Safety Passport Summary */}
        {cat.aiProfileSummary && (
          <div className="ai-highlight-box" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
              <Sparkles size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Identificação Descritiva de Segurança (IA)</strong>
            </div>
            <p style={{ color: 'var(--color-text)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {cat.aiProfileSummary}
            </p>
          </div>
        )}

        {/* Contact Relay Section (TASK-142 Privacy Intermediate) */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Contatar Tutor (Contact Relay)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <a href={`tel:${cat.ownerPhone}`} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Phone size={18} /> Ligação de Emergência
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ justifyContent: 'center', borderColor: '#25D366', color: '#25D366' }}>
              <MessageCircle size={18} /> WhatsApp Tutor
            </a>
            <a href={`mailto:${cat.ownerEmail}`} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Mail size={18} /> E-mail Tutor
            </a>
          </div>
        </div>

        {/* Report Sighting Form (TASK-141) */}
        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--color-danger)" /> Viu ou Encontrou este Felino?
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Envie o local de avistamento e seu telefone para o tutor ser notificado imediatamente.
          </p>

          {sightingSent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-success)' }}>
              <CheckCircle2 size={40} style={{ marginBottom: '0.5rem' }} />
              <h4>Avistamento Registrado com Sucesso!</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                As informações foram enviadas para o tutor. Muito obrigado por colaborar!
              </p>
            </div>
          ) : (
            <form onSubmit={handleReportSighting}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Seu Nome</label>
                  <input
                    type="text"
                    value={finderName}
                    onChange={(e) => setFinderName(e.target.value)}
                    placeholder="Ex: Maria"
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Seu Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={finderPhone}
                    onChange={(e) => setFinderPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Localização de Avistamento *</label>
                  <button type="button" onClick={handleGetLocation} style={{ background: 'none', border: 'none', color: 'var(--color-info)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    📍 Capturar GPS Atual
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Ex: Rua Oscar Freire, próximo à padaria..."
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Observações do Encontro</label>
                <textarea
                  rows={2}
                  value={finderNotes}
                  onChange={(e) => setFinderNotes(e.target.value)}
                  placeholder="Ex: Está calmo, bebendo água em uma tigela..."
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={18} /> Alertar Tutor do Avistamento
              </button>
            </form>
          )}
        </div>
      </div>

      {onBackToApp && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button className="btn btn-secondary" onClick={onBackToApp}>
            Ir para o Painel Cat Guardian
          </button>
        </div>
      )}
    </div>
  )
}
