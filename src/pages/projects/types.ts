export interface Project {
  title: string
  description: string
  detailedDescription?: string
  tags: string[]
  website?: string
  link?: string
  image?: string
  platform: 'web' | 'mobile'
}
