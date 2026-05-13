import { useMemo, useState } from 'react'
import { ArrowLeft, AtSign, Check, ExternalLink, Music2, RotateCcw, Save, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useAuthSession } from '../../../../hooks/use-auth'
import { useContentReportDetail } from '../../../../hooks/use-content-reports'
import type { ContentReport, SavedSocialPost, SocialProvider } from '../../../../shared/types/account-types'

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
    return 'Nao registrado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return minutes > 0
    ? `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`
    : `${remainingSeconds}s`
}

function formatViews(views: number): string {
  return new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(views)
}

function ProviderBadge({ provider }: { provider: SocialProvider }) {
  const config = PROVIDERS[provider]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}

function SavedPostCard({ post }: { post: SavedSocialPost }) {
  return (
    <article className="rounded-[20px] border border-black/10 bg-[#fbfbfa] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ProviderBadge provider={post.provider} />
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#666]">
              {formatDuration(post.durationSeconds)}
            </span>
          </div>

          <h3 className="font-heading text-lg font-semibold leading-tight text-[#181818]">
            {post.title}
          </h3>
          <p className="mt-1 font-mono text-sm text-[#666]">{post.creatorHandle}</p>

          <p className="mt-4 text-sm leading-6 text-[#666]">{post.engagementReason}</p>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-[#181818]">Visualizacoes</dt>
              <dd className="mt-1 text-[#666]">{formatViews(post.views)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Salvo em</dt>
              <dd className="mt-1 text-[#666]">{formatDate(post.savedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Curtido em</dt>
              <dd className="mt-1 text-[#666]">{formatDate(post.likedAt)}</dd>
            </div>
          </dl>
        </div>

        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="app-btn-secondary inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold"
        >
          Abrir post
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  )
}

function ReportOverview({
  report,
  isMarkingDone,
  onMarkDone,
}: {
  report: ContentReport
  isMarkingDone: boolean
  onMarkDone: () => void
}) {
  const isEdited = Boolean(report.editedAt)
  const isCompleted = Boolean(report.completedAt)

  return (
    <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 items-start gap-6">
        <div className="app-icon-badge-user flex h-20 w-20 shrink-0 items-center justify-center rounded-full">
          <User className="h-10 w-10 text-white" strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ProviderBadge provider={report.sourceProvider} />
            {isEdited ? (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                Editado
              </span>
            ) : null}
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight text-[#141414]">
            {report.title}
          </h1>
          <p className="mt-4 max-w-[760px] text-base leading-7 text-[#666]">{report.summary}</p>

          <dl className="mt-5 grid gap-3 text-sm text-[#666] sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[#181818]">Gerado em</dt>
              <dd className="mt-1">{formatDate(report.generatedAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#181818]">Feito em</dt>
              <dd className="mt-1">{report.completedAt ? formatDate(report.completedAt) : 'Pendente'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <button
        type="button"
        disabled={isCompleted || isMarkingDone}
        onClick={onMarkDone}
        className="app-btn-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Check className="h-4 w-4" />
        {isMarkingDone ? 'Marcando...' : isCompleted ? 'Feito' : 'Marcar como feito'}
      </button>
    </section>
  )
}

function ScriptEditor({
  report,
  isSaving,
  isResetting,
  onSave,
  onReset,
}: {
  report: ContentReport
  isSaving: boolean
  isResetting: boolean
  onSave: (script: string) => Promise<void>
  onReset: () => Promise<void>
}) {
  const [draftScript, setDraftScript] = useState(report.currentScript)
  const hasDraftChanges = useMemo(
    () => draftScript !== report.currentScript,
    [draftScript, report.currentScript],
  )

  return (
    <div className="app-panel rounded-[24px] p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[#141414]">
            Roteiro completo
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#666]">
            Edite o roteiro final que sera usado para gravar o video.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {report.editedAt ? (
            <button
              type="button"
              onClick={onReset}
              disabled={isResetting}
              className="app-btn-secondary inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              {isResetting ? 'Restaurando...' : 'Ver original'}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onSave(draftScript.trim())}
            disabled={!draftScript.trim() || !hasDraftChanges || isSaving}
            className="app-btn-primary inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar roteiro'}
          </button>
        </div>
      </div>

      <textarea
        value={draftScript}
        onChange={(event) => setDraftScript(event.target.value)}
        rows={18}
        className="min-h-[520px] w-full resize-y rounded-[18px] border border-black/10 bg-[#fbfbfa] px-5 py-4 font-body text-[0.98rem] leading-7 text-[#181818] outline-none transition-colors placeholder:text-[#8f8f8f] focus:border-black/25 focus:bg-white"
      />
    </div>
  )
}

export function ReportDetailsPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const { user } = useAuthSession()
  const {
    reportQuery,
    updateScriptMutation,
    resetScriptMutation,
    markDoneMutation,
  } = useContentReportDetail({ userId: user?.id, reportId })
  const report = reportQuery.data

  async function handleSaveScript(script: string): Promise<void> {
    if (!script) {
      return
    }

    await updateScriptMutation.mutateAsync(script)
  }

  async function handleResetScript(): Promise<void> {
    await resetScriptMutation.mutateAsync()
  }

  return (
    <main className="mx-auto w-full max-w-[1128px] px-6 py-10 md:px-0">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-[0.96rem] font-medium text-[#666] transition-colors hover:text-[#141414]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para relatorios
        </Link>

        {reportQuery.isLoading ? (
          <div className="space-y-5">
            <div className="h-[180px] animate-pulse rounded-[24px] bg-[#f0f0ee]" />
            <div className="h-[420px] animate-pulse rounded-[24px] bg-[#f0f0ee]" />
          </div>
        ) : null}

        {reportQuery.error ? (
          <div className="rounded-[22px] border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
            {reportQuery.error.message}
          </div>
        ) : null}

        {report ? (
          <div className="space-y-6">
            <ReportOverview
              report={report}
              isMarkingDone={markDoneMutation.isPending}
              onMarkDone={() => {
                void markDoneMutation.mutateAsync()
              }}
            />

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <ScriptEditor
                key={`${report.id}-${report.currentScript}`}
                report={report}
                isSaving={updateScriptMutation.isPending}
                isResetting={resetScriptMutation.isPending}
                onSave={handleSaveScript}
                onReset={handleResetScript}
              />

              <aside className="space-y-4">
                <div className="rounded-[24px] border border-black/10 bg-white p-5">
                  <h2 className="font-heading text-xl font-semibold text-[#141414]">
                    Sinais usados
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {report.signals.map((signal) => (
                      <span
                        key={signal}
                        className="rounded-full border border-black/10 bg-[#f4f4f2] px-3 py-1 text-xs font-medium text-[#666]"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-black/10 bg-white p-5">
                  <h2 className="font-heading text-xl font-semibold text-[#141414]">
                    Curadoria
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#666]">
                    Roteiro gerado apos 1 dia de leitura dos posts curtidos e salvos na rede conectada.
                  </p>
                </div>
              </aside>
            </section>

            <section className="app-panel rounded-[24px] p-6">
              <div className="mb-5">
                <h2 className="font-heading text-2xl font-semibold text-[#141414]">Posts salvos</h2>
                <p className="mt-2 text-sm leading-6 text-[#666]">
                  Referencias que ajudaram a IA a montar o roteiro deste video.
                </p>
              </div>

              <div className="grid gap-4">
                {report.savedPosts.map((post) => (
                  <SavedPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>
        ) : null}
    </main>
  )
}
