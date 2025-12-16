import type { Project } from './types'

export const projects: Project[] = [
  {
    title: 'Finisterre Gardenz',
    description:
      'GIS-powered cross-platform system for cemetery plot inventory and navigation. Real-time tracking, web/Android apps, turn-by-turn navigation with TTS for Finisterre Gardenz.',
    detailedDescription:
      'Finisterre Gardenz is a comprehensive cemetery management system that leverages GIS technology to provide real-time plot inventory and navigation solutions. The system includes both web and Android applications, allowing users to easily locate and manage cemetery plots. Key features include turn-by-turn navigation with text-to-speech (TTS) capabilities, ensuring a seamless experience for visitors. The platform is designed to streamline cemetery operations, enhance user experience, and provide accurate, up-to-date information on plot availability and locations.',
    tags: ['React', 'Tailwind', 'PHP'],
    website: 'https://www.finisterre.site',
    image: '/images/projects/finisterre.avif',
    platform: 'web',
  },
  {
    title: 'AskMeBot',
    description:
      'Chatbot that gives replies based on stored FAQs in a vector database. No made-up answers. Clear and direct info only.',
    detailedDescription:
      'Finisterre Gardenz is a comprehensive cemetery management system that leverages GIS technology to provide real-time plot inventory and navigation solutions. The system includes both web and Android applications, allowing users to easily locate and manage cemetery plots. Key features include turn-by-turn navigation with text-to-speech (TTS) capabilities, ensuring a seamless experience for visitors. The platform is designed to streamline cemetery operations, enhance user experience, and provide accurate, up-to-date information on plot availability and locations.',
    tags: ['React', 'RAG', 'AI'],
    website: 'https://rag-ten-green.vercel.app',
    link: 'https://github.com/archieamas11/RAG',
    image: '/images/projects/askme.png',
    platform: 'web',
  },
  {
    title: 'Shoptify',
    description:
      'Desktop shopping app in Java with Swing and MySQL. Role-based access for customers (browse, cart, checkout, rate) and admins (inventory, reviews). Showcases OOP, GUI, and DB skills.',
    detailedDescription:
      'Finisterre Gardenz is a comprehensive cemetery management system that leverages GIS technology to provide real-time plot inventory and navigation solutions. The system includes both web and Android applications, allowing users to easily locate and manage cemetery plots. Key features include turn-by-turn navigation with text-to-speech (TTS) capabilities, ensuring a seamless experience for visitors. The platform is designed to streamline cemetery operations, enhance user experience, and provide accurate, up-to-date information on plot availability and locations.',
    tags: ['Java', 'MySQL', 'Swing'],
    link: '#',
    image: '/images/projects/shoptify.avif',
    platform: 'web',
  },
  // {
  //   title: 'Queen’z Retail POS',
  //   description:
  //     'A desktop POS and inventory system for Queen’z that streamlines sales, tracks stock in real time, shows monthly reports, and supports Excel import.',
  //   tags: ['Java', 'MySQL', 'Swing'],
  //   link: 'https://github.com/archieamas11/queenz_inventory_system',
  //   image: '/images/projects/queenz.avif',
  //   platform: 'web',
  // },
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
