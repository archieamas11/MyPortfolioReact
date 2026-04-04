import type { SectionId } from '../types'

const HASH_TO_SECTION: Record<string, SectionId> = {
  '#hero': 'home-nav',
  '#about-me': 'about-nav',
  '#projects': 'projects-nav',
  '#contact': 'contact-nav',
}

const SECTION_TO_HASH: Record<SectionId, string> = {
  'home-nav': '#hero',
  'about-nav': '#about-me',
  'projects-nav': '#projects',
  'contact-nav': '#contact',
  'chatbot-nav': '#chatbot',
}

export const hashToSectionId = (hash: string): SectionId => {
  return HASH_TO_SECTION[hash] || 'home-nav'
}

export const sectionIdToHash = (sectionId: SectionId): string => {
  return SECTION_TO_HASH[sectionId] || '#hero'
}
