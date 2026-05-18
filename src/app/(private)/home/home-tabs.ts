import { Compass, Grid3X3, type LucideIcon } from 'lucide-react'

export type HomeTab = 'creator' | 'explore'

export interface HomeTabDefinition {
  value: HomeTab
  label: string
  ariaLabel: string
  icon: LucideIcon
  path: string
}

export const HOME_TABS: HomeTabDefinition[] = [
  {
    value: 'creator',
    label: 'Creator',
    ariaLabel: 'Creator',
    icon: Grid3X3,
    path: '/',
  },
  {
    value: 'explore',
    label: 'Explorar',
    ariaLabel: 'Explorar',
    icon: Compass,
    path: '/explore',
  },
]
