import type { ComponentType, ReactNode } from 'react'

export type SkillLevel = 'advanced' | 'intermediate' | 'beginner'

export interface SkillItem {
  experience: number
  icon: ComponentType<{ size?: string | number }>
  label: string
  level: SkillLevel
  progressWidth: string
}

export interface ExperienceItem {
  company: string
  date: string
  points: ReactNode
  role: string
}

export interface EducationItem {
  degree?: string
  level: string
  logo: string
  school: string
}
