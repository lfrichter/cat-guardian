import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PublicCatPassport } from './PublicCatPassport'

describe('PublicCatPassport UI Component', () => {
  it('renders loading state initially', () => {
    render(<PublicCatPassport catId="seed-cat-kiara" />)
    expect(screen.getByText(/Carregando Cartão de Segurança Felino/i)).toBeInTheDocument()
  })

  it('renders missing cat message when cat ID is invalid', async () => {
    render(<PublicCatPassport catId="invalid-id" />)
    const errorMsg = await screen.findByText(/Gato Não Encontrado/i)
    expect(errorMsg).toBeInTheDocument()
  })
})
