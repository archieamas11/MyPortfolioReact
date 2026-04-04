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
    link: 'https://github.com/archieamas11/finisterre',
    image: '/images/projects/finisterre.avif',
    platform: 'web',
  },
  {
    title: 'AskMeBot',
    description:
      'Chatbot that gives replies based on stored FAQs in a vector database. No made-up answers. Clear and direct info only.',
    detailedDescription:
      'AskMeBot is an intelligent chatbot application that leverages Retrieval-Augmented Generation (RAG) technology to provide accurate, context-aware responses. The system uses a vector database to store and retrieve FAQs, ensuring that all answers are based on verified information rather than generated content. This approach eliminates hallucinations and provides users with reliable, direct information. Built with React and modern AI technologies, AskMeBot demonstrates advanced natural language processing capabilities while maintaining accuracy and trustworthiness.',
    tags: ['React', 'RAG', 'AI'],
    website: 'https://rag-ten-green.vercel.app',
    image: '/images/projects/askme.avif',
    platform: 'web',
  },
  {
    title: 'Shoptify',
    description:
      'Desktop shopping app in Java with Swing and MySQL. Role-based access for customers (browse, cart, checkout, rate) and admins (inventory, reviews). Showcases OOP, GUI, and DB skills.',
    detailedDescription:
      'Shoptify is a comprehensive desktop shopping application built with Java Swing and MySQL, demonstrating strong object-oriented programming principles and database management skills. The application features a dual-role system: customers can browse products, manage shopping carts, complete checkouts, and rate products, while administrators have access to inventory management and review moderation tools. The system showcases advanced GUI design, efficient database operations, and robust user authentication and authorization mechanisms.',
    tags: ['Java', 'MySQL', 'Swing'],
    link: 'https://github.com/archieamas11/shoptify',
    image: '/images/projects/shoptify.avif',
    platform: 'web',
  },
  {
    title: 'Finisterre Mobile',
    description:
      'Finisterre Gardenz Mobile is a React Native app that lets users locate graves, check their owned plots, stay updated with news, offers, and announcements, and view plot availability even without internet.',
    tags: ['Capacitor', 'PHP'],
    link: 'https://github.com/archieamas11/finisterre',
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
