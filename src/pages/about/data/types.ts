import type { ComponentType, ReactNode } from 'react'

export type SkillLevel = 'advanced' | 'intermediate' | 'beginner'

export interface SkillItem {
  icon: ComponentType<{ size?: string | number }>
  label: string
  experience: number
  level: SkillLevel
  progressWidth: string
}

export interface ExperienceItem {
  date: string
  role: string
  company: string
  points: ReactNode
}

export interface EducationItem {
  level: string
  logo: string
  school: string
  degree?: string
}
