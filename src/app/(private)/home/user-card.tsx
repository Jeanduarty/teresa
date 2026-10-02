import { useMemo } from 'react'
import { AtSign, Compass, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ButtonLink } from '../../../components/ui'
import { UserAvatar } from '../../../components/user-avatar'
import { useAuthSession } from '../../../hooks/use-auth'
import { useAvatarUpload } from '../../../hooks/use-avatar-upload'
import { useSocialAccounts } from '../../../hooks/use-social-accounts'
import { useUserAvatar } from '../../../hooks/use-user-avatar'

export function UserCard() {
  const { user } = useAuthSession()
  const avatarQuery = useUserAvatar(user)
  const { uploadMutation } = useAvatarUpload()
  const { accountsQuery } = useSocialAccounts(user?.id)

  const connectedAccounts = useMemo(
    () => (accountsQuery.data ?? []).filter((acc) => {
      if (acc.provider === 'idea') return false
      if (acc.provider === 'tiktok') return acc.webSessionStatus === 'active'
      return acc.isConnected
    }),
    [accountsQuery.data],
  )

  return (
    <section aria-label="Perfil" className="mb-10 flex min-w-0 items-start gap-6">
      <UserAvatar
        editable
        disabled={uploadMutation.isPending}
        avatarUrl={avatarQuery.avatarUrl}
        name={user?.realName?.trim() || user?.userName || 'Criador'}
        className="h-24 w-24 shrink-0"
        iconClassName="h-12 w-12"
        onChange={(file) => {
          uploadMutation.reset()
          void uploadMutation.mutateAsync(file)
        }}
      />

      <div className="min-w-0 pt-1">
        <h1 className="font-heading mb-1 text-3xl font-bold text-[#141414]">
          {user?.realName?.trim() || 'Criador'}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-base text-[#666]">@{user?.userName ?? 'usuario'}</p>

          {accountsQuery.isLoading ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#999]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ccc]" />
              Verificando redes
            </span>
          ) : connectedAccounts.length === 0 ? (
            <Link
              to="/settings/social"
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:border-red-300"
            >
              <span className="h-2 w-2 rounded-full bg-red-500" />
              0 redes conectadas
            </Link>
          ) : (
            connectedAccounts.map((acc) => {
              const Icon = acc.provider === 'tiktok' ? Music2 : AtSign
              const label = acc.provider === 'tiktok' ? 'TikTok' : 'X'
              return (
                <Link
                  key={acc.provider}
                  to="/settings/social"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#666] transition-colors hover:border-black/20"
                >
                  <span className="h-2 w-2 rounded-full bg-[#1d9a52]" />
                  <Icon className="h-3 w-3" />
                  {label} conectado
                </Link>
              )
            })
          )}

          <ButtonLink
            to="/creator-profile"
            variant="outline"
            size="xs"
            icon={<Compass className="h-3.5 w-3.5" />}
            className="rounded-full text-[#666]"
          >
            Sua marca
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
