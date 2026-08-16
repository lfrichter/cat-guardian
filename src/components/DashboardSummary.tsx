import React from 'react'
import { Cat } from '@/types/cat'
import { HealthRecord, computeHealthStatus } from '@/types/health'
import { catService } from '@/services/cat-service'
import { ShieldCheck, AlertTriangle, Cat as CatIcon, HeartPulse, Bell } from 'lucide-react'

interface DashboardSummaryProps {
  cats: Cat[]
  onSelectCat: (cat: Cat) => void
  onOpenPublicPassport?: (catId: string) => void
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  cats,
  onSelectCat,
  onOpenPublicPassport,
}) => {
  const [allHealthRecords, setAllHealthRecords] = React.useState<Record<string, HealthRecord[]>>({})

  React.useEffect(() => {
    cats.forEach((cat) => {
      catService.getHealthRecords(cat.id).then((records) => {
        setAllHealthRecords((prev) => ({ ...prev, [cat.id]: records }))
      })
    })
  }, [cats])

  const totalCats = cats.length
  const lostCats = cats.filter((c) => c.isLost)
  const safeCats = cats.filter((c) => !c.isLost)

  const attentionCatsCount = cats.filter((cat) => {
    const records = allHealthRecords[cat.id] || []
    return computeHealthStatus(records).level === 'NEEDS_ATTENTION'
  }).length

  const handleAlertClick = (lostCat: Cat) => {
    if (onOpenPublicPassport) {
      onOpenPublicPassport(lostCat.id)
    } else {
      onSelectCat(lostCat)
    }
  }

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Active Emergency Alert Banner if any cat is missing */}
      {lostCats.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-danger), #e11d48)',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-glow-coral)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={28} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                🚨 {lostCats.length} {lostCats.length === 1 ? 'FELINO DECLARADO DESAPARECIDO' : 'FELINOS DESAPARECIDOS'}
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                {lostCats.map((c) => c.name).join(', ')} — Tag QR e alertas públicos de resgate ativos.
              </p>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => handleAlertClick(lostCats[0])}
            style={{ background: '#ffffff', color: 'var(--color-danger)', fontWeight: '700', border: 'none' }}
          >
            Ver Alerta de {lostCats[0].name}
          </button>
        </div>
      )}

      {/* Safety Status Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(167, 139, 250, 0.15)', padding: '0.85rem', borderRadius: '14px' }}>
            <CatIcon size={24} color="var(--color-primary)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              Total de Felinos
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: 1.1 }}>
              {totalCats}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.15)', padding: '0.85rem', borderRadius: '14px' }}>
            <ShieldCheck size={24} color="var(--color-success)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              Protegidos em Casa
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-success)', lineHeight: 1.1 }}>
              {safeCats.length}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(251, 191, 36, 0.15)', padding: '0.85rem', borderRadius: '14px' }}>
            <HeartPulse size={24} color="var(--color-warning)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              Reforço Vacinal Pendente
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-warning)', lineHeight: 1.1 }}>
              {attentionCatsCount}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: lostCats.length > 0 ? 'rgba(251, 113, 133, 0.15)' : 'rgba(244, 247, 251, 0.05)', padding: '0.85rem', borderRadius: '14px' }}>
            <Bell size={24} color={lostCats.length > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)'} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              Modo Perdido Ativo
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: lostCats.length > 0 ? 'var(--color-danger)' : 'var(--color-text)', lineHeight: 1.1 }}>
              {lostCats.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
