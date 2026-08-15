import React from 'react'
import { ShieldCheck, Cat, QrCode, AlertTriangle, Sparkles, HeartPulse } from 'lucide-react'

export const App: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff9f1c, #ff4081)',
            padding: '0.75rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(255, 159, 28, 0.4)'
          }}>
            <Cat size={28} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1.1 }}>Cat Guardian</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Passaporte de Segurança Felino & IA</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-safe">
            <ShieldCheck size={14} /> Jidoka Active
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ color: 'var(--accent-amber)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MVP Framework IA 2.0
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0.5rem 0 1rem 0', lineHeight: 1.2 }}>
              Proteção inteligente e passaporte digital para o seu gato.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.75rem' }}>
              Mantenha o perfil de saúde, características visuais, QR code de coleira e ativação instantânea do Modo Perdido para o seu pet.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary">
                <Cat size={18} /> Explorar Gatos (7 Cadastrados)
              </button>
              <button className="btn btn-secondary">
                <Sparkles size={18} color="var(--accent-purple)" /> Perfil de IA
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid Scaffolding */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}><Cat size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Cat Profile</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Identidade do felino, microchip, raça, fotos e dados do tutor.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}><HeartPulse size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Health Passport</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Histórico de vacinas, alergias, peso e agendamentos médicos.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}><QrCode size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Dynamic QR Tag</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              QR Code dinâmico para a coleira vinculado à página de emergência.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }}><AlertTriangle size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Lost Mode</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Ativação em 1 clique do alerta público de gato desaparecido.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
