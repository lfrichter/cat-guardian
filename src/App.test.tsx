import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('Cat Guardian App Scaffolding', () => {
  it('renders application brand title', () => {
    render(<App />)
    expect(screen.getByText(/Cat Guardian/i)).toBeInTheDocument()
  })

  it('renders seed cats badge count or message', () => {
    render(<App />)
    expect(screen.getByText(/Passaporte de Segurança Felino/i)).toBeInTheDocument()
  })
})
