import type { PropsWithChildren } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Logo } from '../../../shared/branding/logo'

type ActivePath = 'newsletters' | 'terms' | 'privacy'

interface NewsletterPageShellProps {
  activePath?: ActivePath
}

const navItems: { label: string; to: string; activePath: ActivePath }[] = [
  { label: 'Novidades', to: '/newsletters', activePath: 'newsletters' },
  { label: 'Termos', to: '/legal/terms', activePath: 'terms' },
  { label: 'Privacidade', to: '/legal/privacy', activePath: 'privacy' },
]

export function NewsletterPageShell({
  activePath,
  children,
}: PropsWithChildren<NewsletterPageShellProps>) {
  const location = useLocation()
  const resolvedActive =
    activePath ??
    (location.pathname.startsWith('/legal/privacy')
      ? 'privacy'
      : location.pathname.startsWith('/legal/terms')
        ? 'terms'
        : 'newsletters')

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#181818]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-0">
          <Link to="/newsletters" aria-label="Ir para novidades da Teresa">
            <Logo
              imageClassName="h-9 w-9"
              textClassName="text-[1.02rem] tracking-[0.14em]"
            />
          </Link>

          <nav
            className="flex flex-wrap items-center gap-1.5"
            aria-label="Navegação pública"
          >
            <div className="inline-flex items-center rounded-full border border-black/5 bg-[#f4f4f2] p-1">
              {navItems.map((item) => {
                const isActive = resolvedActive === item.activePath

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-[#181818] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.18)]'
                        : 'text-[#666] hover:text-[#181818]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#181818] px-4 py-2 text-sm font-semibold !text-white transition-colors hover:bg-[#000]"
            >
              Abrir app
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="mt-20 border-t border-black/5 bg-white/60">
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-3 px-6 py-6 text-xs text-[#888] md:flex-row md:items-center md:justify-between md:px-0">
          <p>© {new Date().getFullYear()} Teresa · Inteligência criativa para creators.</p>
          <div className="flex items-center gap-4">
            <Link to="/legal/terms" className="hover:text-[#181818]">
              Termos
            </Link>
            <Link to="/legal/privacy" className="hover:text-[#181818]">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
