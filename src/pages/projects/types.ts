export interface Project {
  description: string
  detailedDescription?: string
  image?: string
  link?: string
  platform: 'web' | 'mobile'
  tags: string[]
  title: string
  website?: string
}
