import { Resend } from 'resend'
import { logClientError } from '@/utils/log-error'

const resendToken = import.meta.env.VITE_RESEND_TOKEN

const resend = resendToken ? new Resend(resendToken) : null

export interface SightingEmailParams {
  catName: string
  ownerEmail?: string
  finderName?: string
  finderPhone: string
  location: string
  message?: string
}

export const emailService = {
  /**
   * TASK-142: Send Blind Contact Relay email notification to owner via Resend API
   */
  async sendSightingNotification({
    catName,
    finderName,
    finderPhone,
    location,
    message,
  }: SightingEmailParams): Promise<boolean> {
    if (!resend) {
      console.warn('[emailService] VITE_RESEND_TOKEN missing, email skipped.')
      return false
    }

    try {
      // In Resend dev mode, emails must be delivered to verified tester address
      const recipient = 'catguardian213@gmail.com'

      const { error } = await resend.emails.send({
        from: 'Cat Guardian Safety <onboarding@resend.dev>',
        to: recipient,
        subject: `🚨 ALERTA DE AVISTAMENTO: ${catName} foi avistado!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0B1020; color: #F4F7FB; border-radius: 12px;">
            <h2 style="color: #FB7185;">🚨 Alerta de Avistamento — Cat Guardian</h2>
            <p>Seu felino <strong>${catName}</strong> foi avistado por um colaborador da rede de proteção!</p>

            <div style="background-color: #11182B; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #18233A;">
              <p><strong>📍 Local de Avistamento:</strong> ${location}</p>
              <p><strong>📞 Telefone do Fundador:</strong> <a href="tel:${finderPhone}" style="color: #A78BFA;">${finderPhone}</a></p>
              ${finderName ? `<p><strong>👤 Nome do Fundador:</strong> ${finderName}</p>` : ''}
              ${message ? `<p><strong>💬 Observações:</strong> ${message}</p>` : ''}
            </div>

            <p style="font-size: 0.85em; color: #A8B3C7;">
              Esta é uma mensagem automatizada do Blind Contact Relay da plataforma Cat Guardian. Os dados do tutor permanecem protegidos.
            </p>
          </div>
        `,
      })

      if (error) {
        logClientError({ error, context: 'emailService.sendSightingNotification', userEmail: recipient })
        return false
      }

      return true
    } catch (err) {
      logClientError({ error: err, context: 'emailService.sendSightingNotification' })
      return false
    }
  },
}
