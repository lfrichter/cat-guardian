import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@/lib/i18n'
import App from './App'

describe('Cat Guardian App Scaffolding', () => {
  it('renders application brand title', () => {
    render(<App />)
    expect(screen.getByText(/Cat Guardian/i)).toBeInTheDocument()
  })

  it('renders brand tagline or title', () => {
    render(<App />)
    expect(screen.getByText(/Protect. Identify. Find./i)).toBeInTheDocument()
  })
})
