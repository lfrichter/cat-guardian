import React from 'react'
import { Cat, CreateCatInput } from '@/types/cat'
import { catService } from '@/services/cat-service'
import { CatList } from '@/components/CatList'
import { CatDetailModal } from '@/components/CatDetailModal'
import { CatFormModal } from '@/components/CatFormModal'
import { ShieldCheck, Cat as CatIcon, Sparkles } from 'lucide-react'

export const App: React.FC = () => {
  const [cats, setCats] = React.useState<Cat[]>([])
  const [selectedCat, setSelectedCat] = React.useState<Cat | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const loadCats = React.useCallback(async () => {
    setLoading(true)
    try {
      const fetched = await catService.getCats()
      setCats(fetched)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCats()
  }, [loadCats])

  const handleToggleLost = async (cat: Cat) => {
    const updated = await catService.updateCat(cat.id, {
      isLost: !cat.isLost,
      lostNotes: !cat.isLost ? 'Ativado pelo tutor via painel Cat Guardian.' : undefined,
    })
    setCats((prev) => prev.map((c) => (c.id === cat.id ? updated : c)))
    if (selectedCat && selectedCat.id === cat.id) {
      setSelectedCat(updated)
    }
  }

  const handleCreateCat = async (input: CreateCatInput) => {
    const created = await catService.createCat(input)
    setCats((prev) => [created, ...prev])
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-info))',
              padding: '0.75rem',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-lavender)',
            }}
          >
            <CatIcon size={30} color="#0B1020" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.1, margin: 0, color: 'var(--color-text)' }}>Cat Guardian</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Passaporte de Segurança Felino • Midnight Guardian System
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-safe">
            <ShieldCheck size={14} /> Jidoka Verified
          </span>
          <span style={{ color: 'var(--color-primary-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '600' }}>
            <Sparkles size={16} color="var(--color-primary)" /> Guardian AI Ready
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            Carregando passaportes felinos...
          </div>
        ) : (
          <CatList
            cats={cats}
            onSelectCat={(cat) => setSelectedCat(cat)}
            onToggleLost={handleToggleLost}
            onAddCat={() => setIsFormOpen(true)}
          />
        )}
      </main>

      {/* Detail & Health Passport Modal */}
      {selectedCat && (
        <CatDetailModal
          cat={selectedCat}
          onClose={() => setSelectedCat(null)}
          onToggleLost={handleToggleLost}
        />
      )}

      {/* Registration Form Modal */}
      {isFormOpen && (
        <CatFormModal
          onClose={() => setIsFormOpen(false)}
          onSave={handleCreateCat}
        />
      )}
    </div>
  )
}

export default App
