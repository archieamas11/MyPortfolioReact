import { HomeIcon } from '@/components/icons/home'
import { UserIcon } from '@/components/icons/id-card'
import { FolderCodeIcon } from '@/components/icons/git-fork'
import { MessageCircleIcon } from '@/components/icons/message-circle'
import { BotMessageSquareIcon } from '@/components/icons/bot'
import type { NavItem } from './types'

export const navigationItems: NavItem[] = [
  {
    id: 'home-nav',
    label: 'Home',
    icon: HomeIcon,
    href: '#hero',
    ariaLabel: 'Home - navigation bar',
  },
  {
    id: 'about-nav',
    label: 'About',
    icon: UserIcon,
    href: '#about-me',
    ariaLabel: 'About me - Navigation bar',
  },
  {
    id: 'projects-nav',
    label: 'Projects',
    icon: FolderCodeIcon,
    href: '#projects',
    ariaLabel: 'Projects - Navigation bar',
  },
  {
    id: 'contact-nav',
    label: 'Contact',
    icon: MessageCircleIcon,
    href: '#contact',
    ariaLabel: 'Contact me - Navigation bar',
  },
  {
    id: 'chatbot-nav',
    label: 'Chatbot',
    icon: BotMessageSquareIcon,
    href: '#chatbot',
    ariaLabel: 'Chatbot - Navigation bar',
  },
]

export const SCROLL_OFFSET = 400
export const MINI_MODE_THRESHOLD = 50
export const CHATBOT_CLOSE_DELAY = 50
export const SCROLL_TOP_OFFSET = 80
