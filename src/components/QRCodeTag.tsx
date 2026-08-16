import React from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { Cat, canGenerateCollarTag } from '@/types/cat'
import { OwnerProfile } from '@/types/owner'
import { Download, QrCode, AlertTriangle, ShieldCheck, Lock } from 'lucide-react'

interface QRCodeTagProps {
  cat: Cat
  currentUser?: OwnerProfile | null
  onClose?: () => void
}

export const QRCodeTag: React.FC<QRCodeTagProps> = ({ cat, currentUser }) => {
  const { t } = useTranslation()
  const isAuthorizedOwner = canGenerateCollarTag(cat, currentUser || null)

  const publicUrl = `${window.location.origin}/?catId=${cat.id}&mode=public`

  const handleDownload = () => {
    if (!isAuthorizedOwner) return

    const svgElement = document.getElementById(`qr-svg-${cat.id}`)
    if (!svgElement) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = 400
      canvas.height = 480

      if (ctx) {
        // Draw background
        ctx.fillStyle = '#0B1020'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw title
        ctx.fillStyle = '#F4F7FB'
        ctx.font = 'bold 22px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`Cat Guardian — ${cat.name}`, 200, 45)

        // Draw Subtitle / Status
        ctx.fillStyle = cat.isLost ? '#FB7185' : '#34D399'
        ctx.font = '600 14px sans-serif'
        ctx.fillText(cat.isLost ? '⚠️ LOST MODE ACTIVE' : `🛡️ ${t('qrTag.protectedTag')}`, 200, 75)

        // Draw QR Image
        ctx.drawImage(img, 60, 100, 280, 280)

        // Draw Footer
        ctx.fillStyle = '#A8B3C7'
        ctx.font = '12px sans-serif'
        ctx.fillText(t('qrTag.scanInstruction'), 200, 420)
        ctx.fillText(`${t('qrTag.tutorLabel')}: ${cat.ownerName} • ${cat.ownerPhone}`, 200, 445)
      }

      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `QR-Tag-CatGuardian-${cat.name}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  if (!isAuthorizedOwner) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--color-danger)',
        }}
      >
        <Lock size={24} color="var(--color-danger)" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ color: 'var(--color-text)', margin: '0 0 0.25rem 0' }}>Acesso Restrito ao Tutor</h4>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
          Apenas o tutor proprietário cadastrado pode gerar e baixar a Tag de Coleira oficial deste felino.
        </p>
      </div>
    )
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        textAlign: 'center',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: cat.isLost ? '1px solid rgba(251, 113, 133, 0.4)' : '1px solid var(--glass-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <QrCode size={20} color="var(--color-info)" />
        <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text)' }}>
          {t('qrTag.collarTagTitle')} {cat.name}
        </h3>
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        {t('qrTag.subtitle')}
      </p>

      {/* SVG QR Code Container */}
      <div
        style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '16px',
          display: 'inline-block',
          marginBottom: '1.25rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <QRCodeSVG
          id={`qr-svg-${cat.id}`}
          value={publicUrl}
          size={190}
          bgColor="#ffffff"
          fgColor="#0B1020"
          level="H"
          includeMargin={false}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <span className={cat.isLost ? 'badge badge-lost' : 'badge badge-safe'}>
          {cat.isLost ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
          {cat.isLost ? t('catList.lostMode') : t('qrTag.protectedTag')}
        </span>
      </div>

      <button className="btn btn-primary" onClick={handleDownload} style={{ width: '100%', justifyContent: 'center' }}>
        <Download size={18} /> {t('qrTag.downloadBtn')}
      </button>
    </div>
  )
}
