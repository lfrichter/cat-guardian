import React from 'react'
import { useTranslation } from 'react-i18next'
import { Cat, CreateCatInput, UpdateCatInput } from '@/types/cat'
import { catService } from '@/services/cat-service'
import { authService } from '@/services/auth-service'
import { OwnerProfile } from '@/types/owner'
import { DashboardSummary } from '@/components/DashboardSummary'
import { CatList } from '@/components/CatList'
import { CatDetailModal } from '@/components/CatDetailModal'
import { CatFormModal } from '@/components/CatFormModal'
import { AIGeneratorModal } from '@/components/AIGeneratorModal'
import { AIHealthAssistantModal } from '@/components/AIHealthAssistantModal'
import { PublicCatPassport } from '@/components/PublicCatPassport'
import { AuthModal, OwnerProfileDrawer } from '@/components/AuthModal'
import { ShieldCheck, Cat as CatIcon, Sparkles, HeartPulse, User, Globe } from 'lucide-react'

export const App: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [cats, setCats] = React.useState<Cat[]>([])
  const [selectedCat, setSelectedCat] = React.useState<Cat | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [catToEdit, setCatToEdit] = React.useState<Cat | null>(null)
  const [aiCatTarget, setAiCatTarget] = React.useState<Cat | null>(null)
  const [isHealthAssistantOpen, setIsHealthAssistantOpen] = React.useState(false)
  const [isAuthOpen, setIsAuthOpen] = React.useState(false)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<OwnerProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  const [activeTab, setActiveTab] = React.useState<'all' | 'my'>('all')

  const myCats = React.useMemo(() => {
    if (!currentUser) return []
    return cats.filter(
      (c) => c.ownerEmail === currentUser.email || (c.ownerId && c.ownerId === currentUser.id)
    )
  }, [cats, currentUser])

  const displayedCats = activeTab === 'my' ? myCats : cats

  // Public Passport URL Route Handler
  const [activePublicCatId, setActivePublicCatId] = React.useState<string | null>(
    new URLSearchParams(window.location.search).get('catId')
  )

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
    authService.getCurrentUser().then(setCurrentUser)
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    loadCats()
  }, [currentUser, loadCats])

  const handleToggleLost = async (cat: Cat) => {
    if (!currentUser) {
      setIsAuthOpen(true)
      return
    }
    const updated = await catService.updateCat(cat.id, {
      isLost: !cat.isLost,
      lostNotes: !cat.isLost ? 'Ativado pelo tutor via painel Cat Guardian.' : undefined,
    })
    setCats((prev) => prev.map((c) => (c.id === cat.id ? updated : c)))
    if (selectedCat && selectedCat.id === cat.id) {
      setSelectedCat(updated)
    }
  }

  const handleSaveCat = async (input: CreateCatInput | UpdateCatInput, id?: string) => {
    if (!currentUser) {
      setIsAuthOpen(true)
      return
    }
    if (id) {
      const updated = await catService.updateCat(id, input as UpdateCatInput)
      setCats((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } else {
      const created = await catService.createCat({
        ...(input as CreateCatInput),
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        ownerEmail: currentUser.email,
        ownerPhone: currentUser.phone,
      })
      setCats((prev) => [created, ...prev])
      setActiveTab('my')
    }
    setCatToEdit(null)
  }

  const handleDeleteCat = async (id: string) => {
    if (!currentUser) {
      setIsAuthOpen(true)
      return
    }
    await catService.deleteCat(id)
    setCats((prev) => prev.filter((c) => c.id !== id))
    if (selectedCat?.id === id) {
      setSelectedCat(null)
    }
  }

  const handleApplyAIProfile = async (catId: string, aiSummary: string) => {
    const updated = await catService.updateCat(catId, { aiProfileSummary: aiSummary })
    setCats((prev) => prev.map((c) => (c.id === catId ? updated : c)))
    if (selectedCat && selectedCat.id === catId) {
      setSelectedCat(updated)
    }
  }

  const handleSignOut = async () => {
    await authService.signOut()
    setCurrentUser(null)
    setActiveTab('all')
    setIsProfileOpen(false)
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt-BR' : 'en'
    i18n.changeLanguage(newLang)
  }

  const handleOpenPublicPassport = (catId: string) => {
    setSelectedCat(null)
    setActivePublicCatId(catId)
  }

  // If public Cat Passport URL parameter or state is active (QR code scan or public alert view mode)
  if (activePublicCatId) {
    return (
      <PublicCatPassport
        catId={activePublicCatId}
        onBackToApp={() => {
          window.history.pushState({}, '', window.location.pathname)
          setActivePublicCatId(null)
        }}
      />
    )
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.1, margin: 0, color: 'var(--color-text)' }}>
              {t('app.title')}
            </h1>
            <p style={{ color: 'var(--color-primary-light)', fontSize: '0.85rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>
              {t('app.tagline')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Language Switcher */}
          <button
            className="btn btn-secondary"
            onClick={toggleLanguage}
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Globe size={16} color="var(--color-info)" /> {i18n.language === 'en' ? 'EN' : 'PT-BR'}
          </button>

          {/* Explore Demo Golden Path Button */}
          {!currentUser && (
            <button
              className="btn btn-secondary"
              onClick={async () => {
                const demo = await authService.loginAsDemoUser()
                setCurrentUser(demo)
                setActiveTab('my')
              }}
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem', borderColor: 'var(--color-primary)' }}
            >
              <Sparkles size={16} color="var(--color-primary)" /> {t('app.exploreDemo')}
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => setIsHealthAssistantOpen(true)}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          >
            <HeartPulse size={16} color="var(--color-success)" /> {t('app.healthAssistant')}
          </button>

          {currentUser ? (
            <button
              className="btn btn-secondary"
              onClick={() => setIsProfileOpen(true)}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', borderColor: 'var(--color-primary)' }}
            >
              <User size={16} color="var(--color-primary)" /> {currentUser.name}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsAuthOpen(true)}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
            >
              <User size={16} /> {t('app.signIn')}
            </button>
          )}

          <span className="badge badge-safe">
            <ShieldCheck size={14} /> {t('app.jidokaVerified')}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            {t('app.loadingCats')}
          </div>
        ) : (
          <>
            {/* View Mode Navigation Tabs: Rendered ONLY if User is Logged In AND Has Cats */}
            {currentUser && myCats.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                  background: 'var(--color-surface)',
                  padding: '0.4rem',
                  borderRadius: '16px',
                  border: '1px solid var(--glass-border)',
                  width: 'fit-content',
                }}
              >
                <button
                  className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('all')}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '12px',
                    border: activeTab === 'all' ? undefined : 'none',
                  }}
                >
                  <Globe size={16} /> {t('app.allCats')} ({cats.length})
                </button>
                <button
                  className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('my')}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '12px',
                    border: activeTab === 'my' ? undefined : 'none',
                  }}
                >
                  <User size={16} /> {t('app.myCats')} ({myCats.length})
                </button>
              </div>
            )}

            <DashboardSummary
              cats={displayedCats}
              onSelectCat={(cat) => setSelectedCat(cat)}
              onOpenPublicPassport={handleOpenPublicPassport}
            />
            <CatList
              cats={displayedCats}
              titleHeading={activeTab === 'my' ? t('catList.myCatsHeading') : t('catList.allCatsHeading')}
              isAuthenticated={Boolean(currentUser)}
              onSelectCat={(cat) => setSelectedCat(cat)}
              onToggleLost={handleToggleLost}
              onAddCat={() => { setCatToEdit(null); setIsFormOpen(true); }}
              onRequireAuth={() => setIsAuthOpen(true)}
            />
          </>
        )}
      </main>

      {/* Detail & Health Passport Modal */}
      {selectedCat && (
        <CatDetailModal
          cat={selectedCat}
          currentUser={currentUser}
          onClose={() => setSelectedCat(null)}
          onToggleLost={handleToggleLost}
          onEditCat={(cat) => {
            if (!currentUser) {
              setIsAuthOpen(true)
              return
            }
            setCatToEdit(cat)
            setIsFormOpen(true)
          }}
          onRequireAuth={() => setIsAuthOpen(true)}
          onOpenPublicPassport={handleOpenPublicPassport}
        />
      )}

      {/* Registration & Edit Form Modal (Protected by Auth) */}
      {(isFormOpen || catToEdit) && currentUser && (
        <CatFormModal
          catToEdit={catToEdit}
          onClose={() => { setIsFormOpen(false); setCatToEdit(null); }}
          onSave={handleSaveCat}
          onDelete={handleDeleteCat}
        />
      )}

      {/* AI Profile Generator Modal */}
      {aiCatTarget && (
        <AIGeneratorModal
          cat={aiCatTarget}
          onClose={() => setAiCatTarget(null)}
          onApplyProfile={handleApplyAIProfile}
        />
      )}

      {/* AI Health Assistant Modal */}
      {isHealthAssistantOpen && (
        <AIHealthAssistantModal
          cat={selectedCat}
          onClose={() => setIsHealthAssistantOpen(false)}
        />
      )}

      {/* Auth Login/Signup Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(user) => setCurrentUser(user)}
        />
      )}

      {/* Owner Profile Drawer */}
      {isProfileOpen && currentUser && (
        <OwnerProfileDrawer
          owner={currentUser}
          onSignOut={handleSignOut}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  )
}

export default App
