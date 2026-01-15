import NavigationItem from './NavigationItem'
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
        isMini ? 'py-2' : 'py-2',
        isMobile ? 'py-3 px-2' : '',
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
    </ul>
  ),
)

NavigationList.displayName = 'NavigationList'

export default NavigationList
