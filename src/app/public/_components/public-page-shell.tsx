import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { ButtonLink } from '../../../components/ui'
import { Logo } from '../../../shared/branding/logo'

interface PublicPageShellProps {
  activePath?: 'public' | 'terms' | 'privacy'
}

const navItems = [
  { label: 'Novidades', to: '/public', activePath: 'public' },
  { label: 'Termos', to: '/legal/terms', activePath: 'terms' },
  { label: 'Privacidade', to: '/legal/privacy', activePath: 'privacy' },
] as const

export function PublicPageShell({
  activePath,
  children,
}: PropsWithChildren<PublicPageShellProps>) {
  return (
    <div className="app-shell min-h-screen bg-[#fafafa] text-[#666]">
      <header className="sticky top-0 z-30 flex min-h-[80px] w-full items-center justify-center border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="flex w-full max-w-[1128px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-0">
          <Link to="/public" aria-label="Ir para novidades da Teresa">
            <Logo
              imageClassName="h-10 w-10"
              textClassName="text-[1.08rem] tracking-[0.16em]"
            />
          </Link>

          <nav className="flex flex-wrap items-center gap-2" aria-label="Navegacao publica">
            {navItems.map((item) => {
              const isActive = activePath === item.activePath

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-[#181818] bg-[#181818] text-white'
                      : 'border-black/10 bg-white text-[#666] hover:border-black/20 hover:text-[#141414]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <ButtonLink to="/" size="sm" className="rounded-full px-4">
              Abrir app
            </ButtonLink>
          </nav>
        </div>
      </header>

      {children}
    </div>
  )
}
