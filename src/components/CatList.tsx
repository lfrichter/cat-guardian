import React from 'react'
import { Cat } from '@/types/cat'
import { CatCard } from './CatCard'
import { Plus, Search } from 'lucide-react'

interface CatListProps {
  cats: Cat[]
  onSelectCat: (cat: Cat) => void
  onToggleLost: (cat: Cat) => void
  onAddCat: () => void
}

export const CatList: React.FC<CatListProps> = ({ cats, onSelectCat, onToggleLost, onAddCat }) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterLost, setFilterLost] = React.useState(false)

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.colorPattern.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLostFilter = filterLost ? cat.isLost : true
    return matchesSearch && matchesLostFilter
  })

  return (
    <section>
      {/* Search & Actions Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Buscar por nome, raça ou cor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            className={`btn ${filterLost ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterLost(!filterLost)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {filterLost ? 'Mostrando Apenas Perdidos' : 'Filtrar Perdidos'}
          </button>
        </div>

        <button className="btn btn-primary" onClick={onAddCat} style={{ whiteSpace: 'nowrap' }}>
          <Plus size={18} /> Cadastrar Novo Gato
        </button>
      </div>

      {/* Grid of Cat Cards */}
      {filteredCats.length === 0 ? (
        <div
          className="glass-panel"
          style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Nenhum gato encontrado para o filtro selecionado.</p>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setFilterLost(false); }}>
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredCats.map((cat) => (
            <CatCard
              key={cat.id}
              cat={cat}
              onSelect={onSelectCat}
              onToggleLost={onToggleLost}
            />
          ))}
        </div>
      )}
    </section>
  )
}
