export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  ariaLabel: string
}

export type SectionId = 'home-nav' | 'about-nav' | 'projects-nav' | 'contact-nav' | 'chatbot-nav'
