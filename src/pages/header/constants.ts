import { Home, Smile, Code, MessageCircle, Bot } from 'lucide-react'
import type { NavItem } from './types'

export const navigationItems: NavItem[] = [
  {
    id: 'home-nav',
    label: 'Home',
    icon: Home,
    href: '#hero',
    ariaLabel: 'Home - navigation bar',
  },
  {
    id: 'about-nav',
    label: 'About',
    icon: Smile,
    href: '#about-me',
    ariaLabel: 'About me - Navigation bar',
  },
  {
    id: 'projects-nav',
    label: 'Projects',
    icon: Code,
    href: '#projects',
    ariaLabel: 'Projects - Navigation bar',
  },
  {
    id: 'contact-nav',
    label: 'Contact',
    icon: MessageCircle,
    href: '#contact',
    ariaLabel: 'Contact me - Navigation bar',
  },
  {
    id: 'chatbot-nav',
    label: 'Chatbot',
    icon: Bot,
    href: '#chatbot',
    ariaLabel: 'Chatbot - Navigation bar',
  },
]

export const SCROLL_OFFSET = 400
export const MINI_MODE_THRESHOLD = 50
export const CHATBOT_CLOSE_DELAY = 50
export const CHATBOT_TRANSITION_DURATION = 250
export const SCROLL_TOP_OFFSET = 80
