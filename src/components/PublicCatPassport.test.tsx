import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@/lib/i18n'
import { PublicCatPassport } from './PublicCatPassport'

describe('PublicCatPassport UI Component', () => {
  it('renders loading state initially', () => {
    render(<PublicCatPassport catId="seed-cat-kiara" />)
    expect(screen.getByText(/Carregando Cartão de Segurança Felino/i)).toBeInTheDocument()
  })

  it('renders missing cat message when cat ID is invalid', async () => {
    render(<PublicCatPassport catId="invalid-id" />)
    const errorMsg = await screen.findByText(/Cat Not Found|Passaporte Não Encontrado/i)
    expect(errorMsg).toBeInTheDocument()
  })

  it('renders public safety CTA button for missing cat', async () => {
    render(<PublicCatPassport catId="seed-cat-golia" />)
    const ctaButton = await screen.findByText(/I Found This Cat/i)
    expect(ctaButton).toBeInTheDocument()
  })

  it('renders public safety CTA button for protected cat', async () => {
    render(<PublicCatPassport catId="seed-cat-kiara" />)
    const ctaButton = await screen.findByText(/Send Message to Owner/i)
    expect(ctaButton).toBeInTheDocument()
  })
})
