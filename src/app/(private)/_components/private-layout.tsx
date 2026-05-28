import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { IdeaDialogContext } from '../../../contexts/idea-dialog-context'
import { useAuthSession, useLogout } from '../../../hooks/use-auth'
import { useUserAvatar } from '../../../hooks/use-user-avatar'
import { Logo } from '../../../shared/branding/logo'
import { IdeaDialog } from '../home/idea-dialog'
import { TopicSearch } from './topic-search'
import { PrivateProfileMenu } from './private-profile-menu'

function getPageKey(pathname: string): string {
  if (
    pathname === '/' ||
    pathname === '/groups' ||
    pathname.startsWith('/groups/') ||
    pathname === '/explore'
  ) {
    return 'home'
  }
  return pathname
}

type IdeaDialogState = {
  initialIdea: string
  initialStage: 'idea' | 'questions'
  initialQuestions: string[]
}

const DEFAULT_IDEA_STATE: IdeaDialogState = {
  initialIdea: '',
  initialStage: 'idea',
  initialQuestions: [],
}

export function PrivateLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthSession()
  const avatarQuery = useUserAvatar(user)
  const logoutMutation = useLogout()

  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false)
  const [ideaState, setIdeaState] = useState<IdeaDialogState>(DEFAULT_IDEA_STATE)

  async function handleLogout(): Promise<void> {
    await logoutMutation.mutateAsync()
    navigate('/login', { replace: true })
  }

  function openIdeaDialog(idea = '') {
    setIdeaState({ initialIdea: idea, initialStage: 'idea', initialQuestions: [] })
    setIdeaDialogOpen(true)
  }

  function openIdeaDialogAtQuestions(rawIdea: string, questions: string[]) {
    setIdeaState({ initialIdea: rawIdea, initialStage: 'questions', initialQuestions: questions })
    setIdeaDialogOpen(true)
  }

  function handleIdeaDialogClose() {
    setIdeaDialogOpen(false)
    setIdeaState(DEFAULT_IDEA_STATE)
  }

  return (
    <IdeaDialogContext.Provider value={{ openIdeaDialog, openIdeaDialogAtQuestions }}>
      <div className="app-shell font-body min-h-screen bg-[#fafafa] text-[#666]">
        <header className="sticky top-0 z-30 flex h-[80px] w-full items-center justify-center border-b border-black/10 bg-white/95 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-[1128px] items-center justify-between gap-6 px-6 md:px-0">
            <Link to="/" aria-label="Ir para o início" className="shrink-0">
              <Logo
                imageClassName="h-9 w-9"
                textClassName="text-[1.05rem] tracking-[0.16em]"
              />
            </Link>

            <div className="mx-auto hidden w-full max-w-[480px] sm:block">
              <TopicSearch />
            </div>

            {user ? (
              <PrivateProfileMenu
                realName={user.realName}
                userName={user.userName}
                avatarUrl={avatarQuery.avatarUrl}
                settingsHref="/settings/profile"
                onLogout={handleLogout}
              />
            ) : (
              <div className="h-11 w-32 animate-pulse rounded-full bg-[#ececec]" />
            )}
          </div>
        </header>

        <AnimatePresence mode="sync">
          <motion.div
            key={getPageKey(location.pathname)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        <IdeaDialog
          open={ideaDialogOpen}
          onOpenChange={(open) => { if (!open) handleIdeaDialogClose() }}
          userId={user?.id}
          initialIdea={ideaState.initialIdea}
          initialStage={ideaState.initialStage}
          initialQuestions={ideaState.initialQuestions}
        />
      </div>
    </IdeaDialogContext.Provider>
  )
}
