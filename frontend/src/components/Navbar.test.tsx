import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'
import React from 'react'

describe('Navbar', () => {
  it('renders correctly', () => {
    render(<Navbar criticalZones={0} />)
    expect(screen.getByText('CrowdSense')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('shows notification dot when critical zones exist', () => {
    render(<Navbar criticalZones={1} />)
    const bell = screen.getByLabelText('Notifications')
    // Check if the notification dot is present (absolute 0x0 span)
    const dot = bell.querySelector('span')
    expect(dot).toBeInTheDocument()
    expect(dot).toHaveClass('bg-red-500')
  })
})
