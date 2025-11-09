import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResumePage, resumeData } from '../App'

describe('ResumePage', () => {
  it('renders the candidate name and title', () => {
    render(<ResumePage data={resumeData} />)
    expect(screen.getByText(/Nico Kuehn/i)).toBeDefined()
    expect(screen.getByText(/Python Backend Programmer/i)).toBeDefined()
  })

  it('renders skills tags', () => {
    render(<ResumePage data={resumeData} />)
    // root App renders skills as separate tags/spans; query inside the Skills section
    const skillsSection = screen.getByText(/Skills/i).closest('section')
    expect(skillsSection).toBeTruthy()
    if (skillsSection) {
      expect(within(skillsSection).getByText(/Python/)).toBeDefined()
      expect(within(skillsSection).getByText(/React/)).toBeDefined()
    }
  })
})
