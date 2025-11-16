import type { Project } from './types'

export const projects: Project[] = [
  {
    title: 'Finisterre Gardenz',
    description:
      'GIS-powered cross-platform system for cemetery plot inventory and navigation. Real-time tracking, web/Android apps, turn-by-turn navigation with TTS for Finisterre Gardenz.',
    tags: ['React', 'Tailwind', 'PHP'],
    website: 'https://www.finisterre.site',
    // link: '#',
    image: '/images/projects/finisterre.avif',
  },
  {
    title: 'AskMeBot',
    description: 'Chatbot that gives replies based on stored FAQs in a vector database. No made-up answers. Clear and direct info only.',
    tags: ['Chatbot', 'RAG', 'AI'],
    website: 'https://askmebot.example.com',
    link: '#',
    image: '/images/projects/cemeterease.avif',
  },
  {
    title: 'Shoptify',
    description:
      'Desktop shopping app in Java with Swing and MySQL. Role-based access for customers (browse, cart, checkout, rate) and admins (inventory, reviews). Showcases OOP, GUI, and DB skills.',
    tags: ['JAVA', 'MySQL'],
    link: '#',
    image: '/images/projects/shoptify.avif',
  },
]
