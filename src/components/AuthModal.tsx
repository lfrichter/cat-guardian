import React from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '@/services/auth-service'
import { OwnerProfile } from '@/types/owner'
import { X, LogIn, UserPlus, Shield, User, Sparkles } from 'lucide-react'

interface AuthModalProps {
  onClose: () => void
  onAuthSuccess: (user: OwnerProfile) => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const { t } = useTranslation()
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      let user: OwnerProfile
      if (isSignUp) {
        user = await authService.signUp(email, password, name, phone)
      } else {
        user = await authService.signIn(email, password)
      }
      onAuthSuccess(user)
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao realizar autenticação. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--color-primary)', padding: '0.6rem', borderRadius: '12px' }}>
            <Shield size={24} color="#0B1020" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-text)' }}>
              {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Cat Guardian Safety Passport
            </p>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(251, 113, 133, 0.15)',
              border: '1px solid rgba(251, 113, 133, 0.3)',
              color: 'var(--color-danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  {t('auth.nameLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Lucas Richter"
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  {t('auth.phoneLabel')}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98888-7771"
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              {t('auth.emailLabel')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              {t('auth.passwordLabel')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-text)', borderRadius: '8px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {isSignUp ? (
              <>
                <UserPlus size={18} /> {t('auth.signUpBtn')}
              </>
            ) : (
              <>
                <LogIn size={18} /> {t('auth.signInBtn')}
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
            onClick={async () => {
              const demo = await authService.loginAsDemoUser()
              onAuthSuccess(demo)
              onClose()
            }}
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', borderColor: 'var(--color-primary)' }}
          >
            <Sparkles size={16} color="var(--color-primary)" /> {t('app.exploreDemo')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {isSignUp ? t('auth.toggleSignIn') : t('auth.toggleSignUp')}
          </button>
        </div>
      </div>
    </div>
  )
}

export const OwnerProfileDrawer: React.FC<{ owner: OwnerProfile; onSignOut: () => void; onClose: () => void }> = ({
  owner,
  onSignOut,
  onClose,
}) => {
  const { t } = useTranslation()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <User size={32} color="#0B1020" />
          </div>
          <h3 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.3rem' }}>{owner.name}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.2rem 0' }}>{owner.email}</p>
          {owner.phone && <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{owner.phone}</p>}
        </div>

        <button className="btn btn-danger" onClick={onSignOut} style={{ width: '100%', justifyContent: 'center' }}>
          {t('auth.signOut')}
        </button>
      </div>
    </div>
  )
}
