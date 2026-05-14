import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ChevronDown,
  Menu,
  Monitor,
  Shield,
  Share2,
  User,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../../../components/ui'
import { ACCOUNT_SECTIONS, getAccountSectionHref } from './account-settings-utils'
import type { AccountSectionId } from './account-settings-types'

interface AccountSettingsSidebarProps {
  slug: string
  realName: string
  userName: string
  activeSection: AccountSectionId
}

const SECTION_ICONS: Record<AccountSectionId, LucideIcon> = {
  profile: User,
  social: Share2,
  security: Shield,
  sessions: Monitor,
  danger: AlertTriangle,
}

interface SidebarProfileSummaryProps {
  realName: string
  userName: string
}

interface SidebarNavigationProps {
  slug: string
  activeSection: AccountSectionId
  onNavigate?: () => void
}

function SidebarProfileSummary({ realName, userName }: SidebarProfileSummaryProps) {
  const displayName = realName.trim() || userName

  return (
    <div className="mb-9 flex items-center gap-4">
      <div className="app-icon-badge-user flex h-[54px] w-[54px] items-center justify-center rounded-full border border-white/60 shadow-[0_8px_24px_-20px_rgba(0,0,0,0.28)]">
        <User className="h-6 w-6 text-white" strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <h1 className="truncate font-heading text-[1.18rem] font-semibold leading-none text-[#191919]">
          {displayName}
        </h1>
        <p className="font-heading mt-2 truncate text-[0.92rem] font-normal leading-none text-[#6a6a6a]">
          @{userName}
        </p>
      </div>
    </div>
  )
}

function SidebarNavigation({ slug, activeSection, onNavigate }: SidebarNavigationProps) {
  return (
    <section>
      <p className="font-heading mb-3 px-3 text-[0.8rem] font-medium uppercase tracking-[0.07em] text-[#181818]">
        Conta
      </p>

      <nav className="flex flex-col gap-1">
        {ACCOUNT_SECTIONS.map((section) => {
          const Icon = SECTION_ICONS[section.id]
          const isActive = section.id === activeSection

          return (
            <Link
              key={section.id}
              to={getAccountSectionHref(slug, section.id)}
              aria-current={isActive ? 'page' : undefined}
              onClick={onNavigate}
              className={`font-heading flex items-center gap-3 rounded-[14px] px-4 py-[0.76rem] text-[0.94rem] font-medium transition-colors ${
                isActive
                  ? 'bg-[#f4f4f2] text-[#161616]'
                  : 'text-[#666] hover:bg-[#f4f4f2] hover:text-[#161616]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{section.label}</span>
            </Link>
          )
        })}
      </nav>
    </section>
  )
}

export function AccountSettingsSidebar({
  slug,
  realName,
  userName,
  activeSection,
}: AccountSettingsSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const activeSectionLabel =
    ACCOUNT_SECTIONS.find((section) => section.id === activeSection)?.label ?? 'Menu'

  return (
    <aside className="w-full lg:w-[206px] lg:shrink-0">
      <div className="lg:hidden">
        <Button
          aria-expanded={isMobileMenuOpen}
          aria-controls="account-settings-mobile-menu"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          variant="secondary"
          className="font-heading h-auto w-full justify-between rounded-[18px] px-4 py-3.5 text-left shadow-[0_10px_24px_-24px_rgba(0,0,0,0.28)]"
        >
          <span className="flex items-center gap-3 text-[#181818]">
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="text-[0.96rem] font-medium">Abrir menu</span>
          </span>

          <span className="flex items-center gap-2 text-[#666]">
            <span className="font-heading text-[0.88rem] font-medium">{activeSectionLabel}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </Button>

        {isMobileMenuOpen ? (
          <div
            id="account-settings-mobile-menu"
            className="mt-4 rounded-[20px] border border-black/10 bg-white p-4 shadow-[0_18px_34px_-26px_rgba(0,0,0,0.28)]"
          >
            <SidebarProfileSummary realName={realName} userName={userName} />
            <div className="space-y-8">
              <SidebarNavigation
                slug={slug}
                activeSection={activeSection}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden lg:block">
        <SidebarProfileSummary realName={realName} userName={userName} />
        <div className="space-y-8">
          <SidebarNavigation slug={slug} activeSection={activeSection} />
        </div>
      </div>
    </aside>
  )
}
