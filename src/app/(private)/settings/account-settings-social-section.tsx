import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AtSign, Lightbulb, Link2, Music2, RefreshCw, Unplug } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { useSocialAccounts } from '../../../hooks/use-social-accounts'
import type { SocialAccount, SocialProvider } from '../../../shared/types/account-types'
import { Button, Card } from '../../../components/ui'
import { TikTokLoginModal } from '../../../components/tiktok-login-modal'
import { AccountSettingsFeedback } from './account-settings-feedback'

interface AccountSettingsSocialSectionProps {
  userId: string
}

const PROVIDER_LABELS: Record<
  SocialProvider,
  {
    label: string
    icon: LucideIcon
    accentClassName: string
    iconClassName: string
  }
> = {
  twitter: {
    label: 'Twitter/X',
    icon: AtSign,
    accentClassName: 'bg-zinc-900',
    iconClassName: 'bg-zinc-100 text-zinc-900 ring-zinc-200',
  },
  tiktok: {
    label: 'TikTok',
    icon: Music2,
    accentClassName: 'bg-cyan-500',
    iconClassName: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  },
  idea: {
    label: 'Sua ideia',
    icon: Lightbulb,
    accentClassName: 'bg-amber-500',
    iconClassName: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
}

const SOCIAL_CALLBACK_PARAMS = ['social_status', 'social_provider', 'social_message'] as const

interface SocialConnectionFeedback {
  tone: 'success' | 'error'
  message: string
}

function formatConnectedDate(dateString: string | null): string {
  if (!dateString) {
    return 'Ainda nao conectado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

function getProviderLabel(provider: string | null): string {
  return provider === 'twitter' || provider === 'tiktok'
    ? PROVIDER_LABELS[provider].label
    : 'Rede social'
}

function getSocialConnectionFeedback(
  searchParams: URLSearchParams,
): SocialConnectionFeedback | null {
  const status = searchParams.get('social_status')

  if (!status) {
    return null
  }

  const providerLabel = getProviderLabel(searchParams.get('social_provider'))
  const providerMessage = searchParams.get('social_message')

  if (status === 'connected') {
    return {
      tone: 'success',
      message: `${providerLabel} vinculado com sucesso.`,
    }
  }

  if (status === 'error') {
    return {
      tone: 'error',
      message: providerMessage ?? `Nao foi possivel vincular ${providerLabel}.`,
    }
  }

  return null
}

function getTikTokStatusLabel(account: SocialAccount): string {
  if (account.webSessionStatus === 'active') return 'Sessão web ativa'
  if (account.webSessionStatus === 'expired') return 'Sessão expirada'
  if (account.webSessionStatus === 'failed') return 'Falha no último login'
  return 'Não conectado'
}

function getTwitterStatusLabel(account: SocialAccount): string {
  return account.isConnected ? 'Conectado' : 'Pendente'
}

function SocialAccountCard({
  account,
  isConnecting,
  isDisconnecting,
  onConnect,
  onDisconnect,
  onOpenTikTokLogin,
}: {
  account: SocialAccount
  isConnecting: boolean
  isDisconnecting: boolean
  onConnect: (provider: SocialProvider) => void
  onDisconnect: (provider: SocialProvider) => void
  onOpenTikTokLogin: () => void
}) {
  const provider = PROVIDER_LABELS[account.provider]
  const Icon = provider.icon
  const isPending = isConnecting || isDisconnecting
  const isTikTok = account.provider === 'tiktok'

  const statusLabel = isTikTok ? getTikTokStatusLabel(account) : getTwitterStatusLabel(account)

  const tiktokActive = isTikTok && account.webSessionStatus === 'active'
  const tiktokExpired = isTikTok && account.webSessionStatus === 'expired'
  const tiktokConnected = isTikTok ? tiktokActive : account.isConnected
  const displayHandle = isTikTok ? account.webHandle ?? account.handle : account.handle
  const displayDate = isTikTok ? account.webSessionUpdated : account.connectedAt

  return (
    <Card as="article" className="overflow-hidden rounded-[22px] shadow-[0_16px_42px_-34px_rgba(0,0,0,0.45)]">
      <div className={`h-1.5 ${provider.accentClassName}`} />

      <div className="p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ring-1 ${provider.iconClassName}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-heading text-[1.2rem] font-semibold text-[#181818]">
                  {provider.label}
                </h3>
                <span
                  className={`text-sm font-medium ${
                    tiktokExpired ? 'text-amber-700' : 'text-[#666]'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm text-[#666] sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                    Perfil
                  </dt>
                  <dd className="font-heading mt-1 font-medium text-[#181818]">
                    {displayHandle ?? 'Aguardando vinculo'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                    {isTikTok ? 'Sessão atualizada em' : 'Vinculado em'}
                  </dt>
                  <dd className="mt-1 font-heading font-medium text-[#181818]">
                    {formatConnectedDate(displayDate)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {isTikTok ? (
            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              {tiktokActive ? (
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => onDisconnect(account.provider)}
                  variant="danger"
                  size="sm"
                  icon={<Unplug className="h-3.5 w-3.5" />}
                >
                  {isDisconnecting ? 'Removendo...' : 'Desvincular'}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={onOpenTikTokLogin}
                  variant="secondary"
                  size="sm"
                  icon={
                    tiktokExpired ? (
                      <RefreshCw className="h-3.5 w-3.5" />
                    ) : (
                      <Link2 className="h-3.5 w-3.5" />
                    )
                  }
                >
                  {tiktokExpired ? 'Reconectar' : 'Vincular'}
                </Button>
              )}
            </div>
          ) : tiktokConnected ? (
            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              <Button
                type="button"
                disabled={isPending}
                onClick={() => onDisconnect(account.provider)}
                variant="danger"
                size="sm"
                icon={<Unplug className="h-3.5 w-3.5" />}
              >
                {isDisconnecting ? 'Removendo...' : 'Desvincular'}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              disabled={isPending}
              onClick={() => onConnect(account.provider)}
              variant="secondary"
              size="sm"
              className="shrink-0"
              icon={<Link2 className="h-3.5 w-3.5" />}
            >
              {isConnecting ? 'Conectando...' : 'Vincular'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export function AccountSettingsSocialSection({ userId }: AccountSettingsSocialSectionProps) {
  const { accountsQuery, connectMutation, disconnectMutation } = useSocialAccounts(userId)
  const [searchParams, setSearchParams] = useSearchParams()
  const [connectionFeedback] = useState<SocialConnectionFeedback | null>(() =>
    getSocialConnectionFeedback(searchParams),
  )
  const [tiktokModalOpen, setTiktokModalOpen] = useState(false)
  const refetchAccounts = accountsQuery.refetch

  useEffect(() => {
    const status = searchParams.get('social_status')

    if (!status) {
      return
    }

    if (status === 'connected') {
      void refetchAccounts()
    }

    const nextSearchParams = new URLSearchParams(searchParams)
    SOCIAL_CALLBACK_PARAMS.forEach((param) => {
      nextSearchParams.delete(param)
    })
    setSearchParams(nextSearchParams, { replace: true })
  }, [refetchAccounts, searchParams, setSearchParams])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-[#181818]">
          Redes sociais
        </h2>
        <p className="mt-3 max-w-[620px] text-[1.02rem] leading-8 text-[#666]">
          Vincule as contas que autorizam a leitura de posts para gerar briefings automaticos.
        </p>
      </div>

      {accountsQuery.error ? (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {accountsQuery.error.message}
        </div>
      ) : null}

      <AccountSettingsFeedback
        tone={connectionFeedback?.tone ?? 'success'}
        message={connectionFeedback?.message}
      />

      {connectMutation.error ? (
        <AccountSettingsFeedback tone="error" message={connectMutation.error.message} />
      ) : null}

      {disconnectMutation.error ? (
        <AccountSettingsFeedback tone="error" message={disconnectMutation.error.message} />
      ) : null}

      <div className="space-y-4">
        {accountsQuery.isLoading
          ? [0, 1].map((item) => (
              <div key={item} className="h-[136px] animate-pulse rounded-[22px] bg-[#f0f0ee]" />
            ))
          : accountsQuery.data?.map((account) => (
              <SocialAccountCard
                key={account.provider}
                account={account}
                isConnecting={
                  connectMutation.isPending && connectMutation.variables === account.provider
                }
                isDisconnecting={
                  disconnectMutation.isPending && disconnectMutation.variables === account.provider
                }
                onConnect={(provider) => {
                  if (provider === 'twitter') {
                    connectMutation.mutate(provider)
                  }
                }}
                onDisconnect={(provider) => {
                  disconnectMutation.mutate(provider)
                }}
                onOpenTikTokLogin={() => setTiktokModalOpen(true)}
              />
            ))}
      </div>

      <TikTokLoginModal
        open={tiktokModalOpen}
        onOpenChange={setTiktokModalOpen}
        onConnected={() => {
          void refetchAccounts()
        }}
      />
    </div>
  )
}
