import { useEffect, useMemo, useState } from 'react'
import { AtSign, BarChart3, Check, Music2, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuthSession } from '../../hooks/use-auth'
import { useContentReports } from '../../hooks/use-content-reports'
import { useSocialAccounts } from '../../hooks/use-social-accounts'
import type { ContentReport, ContentReportMetrics, SocialProvider } from '../../shared/types/account-types'

const PAGE_SIZE = 3

const PROVIDERS: Record<
  SocialProvider,
  { label: string; icon: LucideIcon; className: string }
> = {
  twitter: {
    label: 'Twitter/X',
    icon: AtSign,
    className: 'border-zinc-200 bg-zinc-50 text-zinc-800',
  },
  tiktok: {
    label: 'TikTok',
    icon: Music2,
    className: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  },
}

function formatDate(dateString: string | null): string {
  if (!dateString) {
    return 'Ainda nao feito'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function MetricsPanel({ metrics }: { metrics?: ContentReportMetrics }) {
  const items = [
    { label: 'Total de relatorios', value: metrics?.total ?? 0 },
    { label: 'Feitos', value: metrics?.completed ?? 0 },
    { label: 'Pendentes', value: metrics?.pending ?? 0 },
    { label: 'Sinais do Twitter/X', value: metrics?.twitterSignals ?? 0 },
    { label: 'Sinais do TikTok', value: metrics?.tiktokSignals ?? 0 },
    { label: 'Taxa de conclusao', value: `${metrics?.completionRate ?? 0}%` },
  ]

  return (
    <div className="absolute right-0 top-14 z-20 w-[min(340px,calc(100vw-48px))] rounded-[22px] border border-black/10 bg-white p-4 shadow-[0_24px_60px_-34px_rgba(0,0,0,0.45)]">
      <div className="mb-3 flex items-center gap-2 text-[#181818]">
        <BarChart3 className="h-4 w-4" />
        <h2 className="font-heading text-base font-semibold">Metricas dos relatorios</h2>
      </div>
      <dl className="grid gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-[14px] bg-[#f4f4f2] px-4 py-3 text-sm"
          >
            <dt className="text-[#666]">{item.label}</dt>
            <dd className="font-heading font-semibold text-[#181818]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ReportItem({
  report,
  isPending,
  onMarkDone,
}: {
  report: ContentReport
  isPending: boolean
  onMarkDone: (reportId: string) => void
}) {
  const isCompleted = Boolean(report.completedAt)
  const provider = PROVIDERS[report.sourceProvider]
  const ProviderIcon = provider.icon

  return (
    <article className="py-7 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${provider.className}`}
            >
              <ProviderIcon className="h-3.5 w-3.5" />
              {provider.label}
            </span>
            {report.editedAt ? (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                Editado
              </span>
            ) : null}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isCompleted
                  ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
              }`}
            >
              {isCompleted ? 'Feito' : 'Pendente'}
            </span>
          </div>

          <h2 className="font-heading text-[1.45rem] font-semibold leading-tight text-[#181818]">
            {report.title}
          </h2>
          <p className="mt-3 max-w-[760px] text-[0.98rem] leading-7 text-[#666]">{report.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {report.signals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#666]"
              >
                {signal}
              </span>
            ))}
          </div>

          <dl className="mt-5 grid gap-3 text-sm text-[#666] sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#181818]">Gerado em</dt>
              <dd className="mt-1">{formatDate(report.generatedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Feito em</dt>
              <dd className="mt-1">{formatDate(report.completedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <button
            type="button"
            disabled={isCompleted || isPending}
            onClick={() => onMarkDone(report.id)}
            className="app-btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            {isPending ? 'Marcando...' : isCompleted ? 'Feito' : 'Marcar como feito'}
          </button>

          <Link
            to={`/reports/${report.id}`}
            className="app-btn-secondary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold w-fit ml-auto"
          >
            Ver detalhes
          </Link>

          
        </div>
      </div>
    </article>
  )
}

export function HomePage() {
  const { user } = useAuthSession()
  const { reportsQuery, metricsQuery, markDoneMutation } = useContentReports(user?.id)
  const { accountsQuery } = useSocialAccounts(user?.id)
  const [isMetricsOpen, setIsMetricsOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const reports = useMemo(() => reportsQuery.data ?? [], [reportsQuery.data])
  const visibleReports = useMemo(() => reports.slice(0, visibleCount), [reports, visibleCount])
  const hasMoreReports = visibleCount < reports.length
  const hasConnectedSocialAccount = useMemo(
    () => accountsQuery.data?.some((account) => account.isConnected) ?? false,
    [accountsQuery.data],
  )
  const connectedAccountsCount = useMemo(
    () => accountsQuery.data?.filter((account) => account.isConnected).length ?? 0,
    [accountsQuery.data],
  )
  const socialAccountsLabel = accountsQuery.isLoading
    ? 'Verificando redes'
    : connectedAccountsCount === 1
      ? '1 rede conectada'
      : `${connectedAccountsCount} redes conectadas`
  const socialAccountsStatusClassName =
    !accountsQuery.isLoading && connectedAccountsCount === 0
      ? 'border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:text-red-800'
      : 'border-black/10 bg-white text-[#666] hover:border-black/20 hover:text-[#141414]'
  const socialAccountsDotClassName =
    !accountsQuery.isLoading && connectedAccountsCount === 0 ? 'bg-red-500' : 'bg-[#1d9a52]'
  const shouldShowSocialShortcut =
    !accountsQuery.isLoading && !accountsQuery.error && !hasConnectedSocialAccount

  useEffect(() => {
    function handleScroll() {
      const distanceToBottom =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY

      if (distanceToBottom < 260) {
        setVisibleCount((current) => Math.min(current + PAGE_SIZE, reports.length))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reports.length])

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10">
        <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-6">
            <div className="app-icon-badge-user flex h-24 w-24 shrink-0 items-center justify-center rounded-full">
              <User className="h-12 w-12 text-white" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <h1 className="font-heading mb-1 text-3xl font-bold text-[#141414]">
                {user?.realName?.trim() || 'Criador'}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-lg text-[#666]">@{user?.userName ?? 'usuario'}</p>
                <Link
                  to="/settings/social"
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${socialAccountsStatusClassName}`}
                >
                  <span className={`h-2 w-2 rounded-full ${socialAccountsDotClassName}`} />
                  {socialAccountsLabel}
                </Link>
              </div>
              <p className="mt-4 max-w-[720px] text-base leading-7 text-[#666]">
                Relatorios gerados automaticamente a partir dos sinais de curtidas e salvos das redes sociais.
              </p>
            </div>
          </div>

          <div className="relative self-start ml-auto">
            <button
              type="button"
              onClick={() => setIsMetricsOpen((current) => !current)}
              className="app-btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
              aria-expanded={isMetricsOpen}
            >
              <BarChart3 className="h-4 w-4" />
              Ver metricas
            </button>
            {isMetricsOpen ? <MetricsPanel metrics={metricsQuery.data} /> : null}
          </div>
        </section>

        <section className="app-panel rounded-[16px] p-6 md:p-8">
          {shouldShowSocialShortcut ? (
            <div className="mb-6 flex flex-col gap-4 rounded-[18px] border border-dashed border-black/15 bg-[#fbfbfa] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#181818]">
                  Vincule uma rede social
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#666]">
                  Conecte Twitter/X ou TikTok para começar a gerar relatórios automaticamente.
                </p>
              </div>

              <Link
                to="/settings/social"
                className="app-btn-primary inline-flex h-11 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold"
              >
                Configurar redes
              </Link>
            </div>
          ) : null}

          <div className="mb-6 flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-[#141414]">Relatorios</h2>
            <p className="text-sm leading-6 text-[#666]">
              Use cada briefing para planejar a proxima pauta e marque como feito quando finalizar.
            </p>
          </div>

          {reportsQuery.isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-[180px] animate-pulse rounded-[18px] bg-[#f0f0ee]" />
              ))}
            </div>
          ) : null}

          {reportsQuery.error ? (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {reportsQuery.error.message}
            </div>
          ) : null}

          {!reportsQuery.isLoading && visibleReports.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-black/15 bg-[#fbfbfa] px-6 py-10 text-center">
              <h3 className="font-heading text-xl font-semibold text-[#181818]">Nenhum relatorio ainda</h3>
              <p className="mt-2 text-sm leading-6 text-[#666]">
                Vincule Twitter/X ou TikTok nas configuracoes para iniciar a coleta de sinais.
              </p>
            </div>
          ) : null}

          <div className="divide-y divide-black/10">
            {visibleReports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                isPending={markDoneMutation.isPending && markDoneMutation.variables === report.id}
                onMarkDone={(reportId) => {
                  void markDoneMutation.mutateAsync(reportId)
                }}
              />
            ))}
          </div>

          {hasMoreReports ? (
            <p className="mt-6 text-center text-sm font-medium text-[#666]">
              Role para carregar mais relatorios.
            </p>
          ) : null}
        </section>
    </main>
  )
}
