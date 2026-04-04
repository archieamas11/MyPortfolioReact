export interface NavItem {
  ariaLabel?: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  id: string
  label?: string
  type?: 'separator'
}

export type SectionId = 'home-nav' | 'about-nav' | 'projects-nav' | 'contact-nav' | 'chatbot-nav'
