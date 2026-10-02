import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Newspaper, Settings } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { Button } from '../../../components/ui'
import { UserAvatar } from '../../../components/user-avatar'

interface PrivateProfileMenuProps {
  realName: string
  userName: string
  avatarUrl?: string | null
  settingsHref: string
  onLogout: () => Promise<void>
}

export function PrivateProfileMenu({
  realName,
  userName,
  avatarUrl,
  settingsHref,
  onLogout,
}: PrivateProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const displayName = realName.trim() || userName

  useEffect(() => {
    function handlePointerDown(event: PointerEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <Button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        variant="secondary"
        className="font-heading h-[50px] rounded-full px-5 text-[0.96rem] text-[#181818] shadow-[0_10px_24px_-24px_rgba(0,0,0,0.28)] hover:bg-[#fbfbfb]"
      >
        <UserAvatar
          avatarUrl={avatarUrl}
          name={displayName}
          className="-ml-2 h-9 w-9"
          iconClassName="h-4 w-4"
        />
        <span>Olá, {displayName}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#666] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-20 mt-4 w-[224px] overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_24px_42px_-28px_rgba(0,0,0,0.34)]"
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <UserAvatar
                avatarUrl={avatarUrl}
                name={displayName}
                className="h-11 w-11 shrink-0"
                iconClassName="h-5 w-5"
              />
              <div className="min-w-0">
                <p className="font-heading truncate text-[1.12rem] font-semibold text-[#181818]">{displayName}</p>
                <p className="font-heading mt-0.5 truncate text-[0.92rem] font-normal text-[#6f6f6f]">
                  @{userName}
                </p>
              </div>
            </div>

            <div className="border-t border-black/10">
              <Link
                to="/news"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="font-heading flex items-center gap-3 px-4 py-3.5 text-[0.98rem] font-medium text-[#181818] transition-colors hover:bg-[#fafafa]"
              >
                <Newspaper className="h-4 w-4" />
                <span>Novidades</span>
              </Link>

              <Link
                to={settingsHref}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="font-heading flex items-center gap-3 border-t border-black/10 px-4 py-3.5 text-[0.98rem] font-medium text-[#181818] transition-colors hover:bg-[#fafafa]"
              >
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>

              <Button
                role="menuitem"
                onClick={() => {
                  setIsOpen(false)
                  void onLogout()
                }}
                variant="ghost"
                className="font-heading h-auto w-full justify-start rounded-none border-t border-black/10 px-4 py-3.5 text-left text-[0.98rem] font-medium text-[#181818] hover:bg-[#fafafa]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
