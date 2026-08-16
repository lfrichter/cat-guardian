import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cat } from '@/types/cat'
import { OwnerProfile } from '@/types/owner'
import { CatCard } from './CatCard'
import { Search, Plus, Cat as CatIcon } from 'lucide-react'

interface CatListProps {
  cats: Cat[]
  titleHeading?: string
  currentUser?: OwnerProfile | null
  isAuthenticated?: boolean
  onSelectCat: (cat: Cat) => void
  onToggleLost: (cat: Cat) => void
  onAddCat: () => void
}

export const CatList: React.FC<CatListProps> = ({
  cats,
  titleHeading,
  currentUser,
  isAuthenticated,
  onSelectCat,
  onToggleLost,
  onAddCat,
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterLostOnly, setFilterLostOnly] = React.useState(false)

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.colorPattern.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterLostOnly ? cat.isLost : true
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      {titleHeading && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--color-text)' }}>
            {titleHeading}
          </h3>
        </div>
      )}
      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder={t('catList.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>

        {/* Filter Badges & Add Button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className={`btn ${filterLostOnly ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setFilterLostOnly(!filterLostOnly)}
            style={{ fontSize: '0.85rem' }}
          >
            {filterLostOnly ? t('catList.showingLostOnly') : t('catList.filterLost')}
          </button>

          {isAuthenticated && (
            <button className="btn btn-primary" onClick={onAddCat} style={{ fontSize: '0.85rem' }}>
              <Plus size={16} /> {t('catList.registerCat')}
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      {filteredCats.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <CatIcon size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
          <h3>{t('catList.noCatsFound')}</h3>
          <p>{t('catList.adjustSearch')}</p>
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
              currentUser={currentUser}
              onSelect={onSelectCat}
              onToggleLost={onToggleLost}
            />
          ))}
        </div>
      )}
    </div>
  )
}
