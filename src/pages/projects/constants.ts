import type { Project } from './types'

export const projects: Project[] = [
  {
    title: 'Finisterre Gardenz',
    description:
      'GIS-powered cross-platform system for cemetery plot inventory and navigation. Real-time tracking, web/Android apps, turn-by-turn navigation with TTS for Finisterre Gardenz.',
    tags: ['React', 'Tailwind', 'PHP'],
    website: 'https://www.finisterre.site',
    image: '/images/projects/finisterre.avif',
    platform: 'web',
  },
  {
    title: 'AskMeBot',
    description:
      'Chatbot that gives replies based on stored FAQs in a vector database. No made-up answers. Clear and direct info only.',
    tags: ['React', 'RAG', 'AI'],
    website: 'https://askmebot.example.com',
    link: '#',
    image: '/images/projects/cemeterease.avif',
    platform: 'web',
  },
  {
    title: 'Shoptify',
    description:
      'Desktop shopping app in Java with Swing and MySQL. Role-based access for customers (browse, cart, checkout, rate) and admins (inventory, reviews). Showcases OOP, GUI, and DB skills.',
    tags: ['JAVA', 'MySQL'],
    link: '#',
    image: '/images/projects/shoptify.avif',
    platform: 'web',
  },
  {
    title: 'Finisterre Mobile',
    description:
      'Finisterre Gardenz Mobile is a React Native app that lets users locate graves, check their owned plots, stay updated with news, offers, and announcements, and view plot availability even without internet.',
    tags: ['React Native', 'PHP'],
    website: 'https://www.finisterre.site',
    image: '/images/projects/finisterre-mobile.avif',
    platform: 'mobile',
  },
  {
    title: 'Self Thoughts',
    description:
      'A digital diary application built with React Native that allows users to write and manage journal entries. It supports cross-device sync with Firebase, offline access, and features like undo/redo and auto-save for a seamless writing experience.',
    tags: ['React Native', 'SQLite', 'Expo'],
    link: 'https://github.com/archieamas11/self-thoughts',
    image: '/images/projects/self-thoughts.avif',
    platform: 'mobile',
  },
]
