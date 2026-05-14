import { Link, Outlet, useNavigate } from 'react-router-dom'

import { useAuthSession, useLogout } from '../../../hooks/use-auth'
import { Logo } from '../../../shared/branding/logo'
import { PrivateProfileMenu } from './private-profile-menu'

export function PrivateLayout() {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const logoutMutation = useLogout()

  async function handleLogout(): Promise<void> {
    await logoutMutation.mutateAsync()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell font-body min-h-screen bg-[#fafafa] text-[#666]">
      <header className="sticky top-0 z-30 flex h-[80px] w-full items-center justify-center border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="flex h-full w-full max-w-[1128px] items-center justify-between gap-4 px-6 md:px-0">
          <Link to="/" aria-label="Ir para o início">
            <Logo
              imageClassName="h-9 w-9"
              textClassName="text-[1.05rem] tracking-[0.16em]"
            />
          </Link>

          {user ? (
            <PrivateProfileMenu
              realName={user.realName}
              userName={user.userName}
              settingsHref="/settings/profile"
              onLogout={handleLogout}
            />
          ) : (
            <div className="h-11 w-32 animate-pulse rounded-full bg-[#ececec]" />
          )}
        </div>
      </header>

      <Outlet />
    </div>
  )
}
