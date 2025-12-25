import Separator from './components/seperator'
import NavigationItem from './NavigationItem'
import ThemeToggleItem from './ThemeToggleItem'
import type { SectionId } from './types'
import { navigationItems } from './constants'
import { cn } from '@/lib/utils'
import { memo } from 'react'

const NavigationList = memo(
  ({
    activeSection,
    isMini,
    isMobile,
    onNavClick,
  }: {
    activeSection: SectionId
    isMini: boolean
    isMobile: boolean
    onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => void
  }) => (
    <ul
      className={cn(
        'bouncy flex list-none flex-row items-center justify-between p-1',
        isMini ? 'py-1.2' : 'py-2',
        isMobile ? 'p-0 pl-1.5' : '',
      )}
    >
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={activeSection === item.id}
          isMini={isMini}
          isMobile={isMobile}
          onClick={onNavClick}
        />
      ))}

      <Separator isMini={isMini} />
      <ThemeToggleItem isMini={isMini} isMobile={isMobile} />
    </ul>
  ),
)

NavigationList.displayName = 'NavigationList'

export default NavigationList
