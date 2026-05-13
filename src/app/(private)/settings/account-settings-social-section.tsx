import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AtSign, ExternalLink, Link2, Music2, Search, Unplug } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { useSocialAccounts } from '../../../hooks/use-social-accounts'
import type {
  SocialAccount,
  SocialDailyLikedPostsResult,
  SocialProvider,
} from '../../../shared/types/account-types'
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

function SocialAccountCard({
  account,
  isConnecting,
  isDisconnecting,
  isFetchingDailyLikedPosts,
  onConnect,
  onDisconnect,
  onFetchDailyLikedPosts,
}: {
  account: SocialAccount
  isConnecting: boolean
  isDisconnecting: boolean
  isFetchingDailyLikedPosts: boolean
  onConnect: (provider: SocialProvider) => void
  onDisconnect: (provider: SocialProvider) => void
  onFetchDailyLikedPosts: (provider: SocialProvider) => void
}) {
  const provider = PROVIDER_LABELS[account.provider]
  const Icon = provider.icon
  const isPending = isConnecting || isDisconnecting || isFetchingDailyLikedPosts
  const statusLabel = account.isConnected ? 'Conectado' : 'Pendente'

  return (
    <article className="overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_16px_42px_-34px_rgba(0,0,0,0.45)]">
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
                <span className="text-sm font-medium text-[#666]">{statusLabel}</span>
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm text-[#666] sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                    Perfil
                  </dt>
                  <dd className="font-heading mt-1 font-medium text-[#181818]">
                    {account.handle ?? 'Aguardando vinculo'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                    Vinculado em
                  </dt>
                  <dd className="mt-1 font-heading font-medium text-[#181818]">
                    {formatConnectedDate(account.connectedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {account.isConnected ? (
            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={() => onFetchDailyLikedPosts(account.provider)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] border border-black/15 bg-white px-3.5 !text-xs font-semibold text-[#181818] transition-colors hover:bg-[#f4f4f2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="h-3.5 w-3.5" />
                {isFetchingDailyLikedPosts ? 'Buscando...' : 'Testar sinais'}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => onDisconnect(account.provider)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] border border-red-200 bg-red-50 px-3.5 !text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Unplug className="h-3.5 w-3.5" />
                {isDisconnecting ? 'Removendo...' : 'Desvincular'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onConnect(account.provider)}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[12px] border border-black/15 bg-white px-3.5 !text-xs font-semibold text-[#181818] transition-colors hover:bg-[#f4f4f2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Link2 className="h-3.5 w-3.5" />
              {isConnecting ? 'Conectando...' : 'Vincular'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function SocialLikedPostsPreview({ result }: { result?: SocialDailyLikedPostsResult }) {
  if (!result) {
    return null
  }

  const provider = PROVIDER_LABELS[result.provider]

  return (
    <section className="rounded-[20px] border border-black/10 bg-[#fbfbfa] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-[#181818]">
            Teste de sinais - {provider.label}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#666]">{result.message}</p>
          {result.request ? (
            <p className="mt-2 font-mono text-xs text-[#8a8a8a]">
              Request {result.request.requestId} - {result.request.status}
            </p>
          ) : null}
        </div>

        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#666]">
          {result.posts.length} posts
        </span>
      </div>

      {result.posts.length > 0 ? (
        <div className="mt-4 space-y-3">
          {result.posts.slice(0, 5).map((post) => (
            <a
              key={post.externalId}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-[16px] border border-black/10 bg-white px-4 py-3 transition-colors hover:bg-[#f4f4f2]"
            >
              <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-[#666]">
                <span>
                  {post.signalType === 'saved' ? 'Salvo' : 'Curtido'} ·{' '}
                  {post.creatorHandle ?? provider.label}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-[#181818]">{post.text}</p>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function AccountSettingsSocialSection({ userId }: AccountSettingsSocialSectionProps) {
  const { accountsQuery, connectMutation, dailyLikedPostsMutation, disconnectMutation } =
    useSocialAccounts(userId)
  const [searchParams, setSearchParams] = useSearchParams()
  const [connectionFeedback] = useState<SocialConnectionFeedback | null>(() =>
    getSocialConnectionFeedback(searchParams),
  )
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
          Vincule as contas que autorizam a leitura de sinais de conteudo para gerar briefings automaticos.
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

      {dailyLikedPostsMutation.error ? (
        <AccountSettingsFeedback tone="error" message={dailyLikedPostsMutation.error.message} />
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
                isFetchingDailyLikedPosts={
                  dailyLikedPostsMutation.isPending &&
                  dailyLikedPostsMutation.variables === account.provider
                }
                onConnect={(provider) => {
                  connectMutation.mutate(provider)
                }}
                onDisconnect={(provider) => {
                  disconnectMutation.mutate(provider)
                }}
                onFetchDailyLikedPosts={(provider) => {
                  dailyLikedPostsMutation.mutate(provider)
                }}
              />
            ))}
      </div>

      <SocialLikedPostsPreview result={dailyLikedPostsMutation.data} />
    </div>
  )
}
