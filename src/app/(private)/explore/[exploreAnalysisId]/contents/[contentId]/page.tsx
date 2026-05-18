import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../../../../../components/ui'
import { useAuthSession } from '../../../../../../hooks/use-auth'
import { useExploreAnalysis } from '../../../../../../hooks/use-explore-analyses'
import type { ExploreContent } from '../../../../../../shared/types/account-types'
import {
  formatDate,
  getContentStatusClassName,
  getContentStatusLabel,
  getPlatformInitials,
} from '../../../_components/explore-utils'

type AnalysisRow = {
  label: string
  value: string | null | undefined
}

function getAnalysisRows(content: ExploreContent): AnalysisRow[] {
  const analysis = content.analysis

  return [
    { label: 'Tom de voz', value: analysis.voiceTone },
    { label: 'Nível de autoridade', value: analysis.authorityLevel },
    { label: 'Estilo narrativo', value: analysis.narrativeStyle },
    { label: 'Emoção predominante', value: analysis.emotion },
    { label: 'Humor', value: analysis.humorLevel },
    { label: 'Sofisticação', value: analysis.sophistication },
    { label: 'Formato', value: analysis.format },
    { label: 'Tipo de hook', value: analysis.hookType },
    { label: 'Hook usado', value: analysis.hookText },
    { label: 'CTA', value: analysis.ctaType },
    { label: 'CTA usado', value: analysis.ctaText },
    { label: 'Estrutura', value: analysis.structure },
    { label: 'Storytelling', value: analysis.storytellingStyle },
    { label: 'Velocidade narrativa', value: analysis.pacing },
    { label: 'Arquétipo', value: analysis.archetype },
    { label: 'Posicionamento', value: analysis.positioning },
    { label: 'Público-alvo', value: analysis.audience },
    { label: 'Percepção transmitida', value: analysis.perception },
    { label: 'Tema principal', value: analysis.mainTheme },
    { label: 'Intenção', value: analysis.intent },
  ]
}

export function ExploreContentDetailPage() {
  const navigate = useNavigate()
  const { exploreAnalysisId, contentId } = useParams<{
    exploreAnalysisId: string
    contentId: string
  }>()
  const { user } = useAuthSession()
  const { analysisQuery } = useExploreAnalysis({
    userId: user?.id,
    exploreAnalysisId,
  })

  if (analysisQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <div className="h-12 w-56 animate-pulse rounded-full bg-[#f0f0ee]" />
        <div className="mt-6 h-64 animate-pulse rounded-[18px] bg-[#f0f0ee]" />
      </main>
    )
  }

  if (analysisQuery.isError || !analysisQuery.data || !contentId) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 rounded-full"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate('/explore')}
        >
          Voltar
        </Button>
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
          {analysisQuery.error?.message ?? 'Conteúdo não encontrado.'}
        </div>
      </main>
    )
  }

  const analysis = analysisQuery.data
  const contentIndex = analysis.contents.findIndex(
    (entry) => entry.id === contentId,
  )
  const content = analysis.contents[contentIndex] ?? null

  if (!content) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 rounded-full"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate(`/explore/${analysis.id}`)}
        >
          Voltar para análise
        </Button>
        <div className="rounded-[18px] border border-black/10 bg-white px-5 py-6 text-sm text-[#666]">
          Conteúdo não encontrado nesta análise.
        </div>
      </main>
    )
  }

  const previousContent = analysis.contents[contentIndex - 1] ?? null
  const nextContent = analysis.contents[contentIndex + 1] ?? null
  const isAnalyzing =
    content.status === 'pending' ||
    content.status === 'fetching' ||
    content.status === 'analyzing'
  const rows = getAnalysisRows(content)
  const hasAnalysis = rows.some((row) => Boolean(row.value))
  const platform = content.platform ?? 'Web'

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-4 rounded-full"
        icon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => navigate(`/explore/${analysis.id}`)}
      >
        Voltar para análise
      </Button>

      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
            {analysis.name}
          </p>
          <h1 className="font-heading mt-1 text-2xl font-bold text-[#141414]">
            Análise do conteúdo
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            {contentIndex + 1} de {analysis.contents.length} ·{' '}
            {platform}
            {content.creatorHandle ? ` · @${content.creatorHandle}` : ''}
            {content.analyzedAt ? ` · ${formatDate(content.analyzedAt)}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            icon={<ChevronLeft className="h-3.5 w-3.5" />}
            disabled={!previousContent}
            onClick={() =>
              previousContent &&
              navigate(`/explore/${analysis.id}/contents/${previousContent.id}`)
            }
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={!nextContent}
            onClick={() =>
              nextContent &&
              navigate(`/explore/${analysis.id}/contents/${nextContent.id}`)
            }
          >
            Próximo
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <section className="mb-6 grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="rounded-[18px] border border-black/10 bg-white p-4">
          {content.previewImageUrl ? (
            <img
              src={content.previewImageUrl}
              alt=""
              className="aspect-video w-full rounded-[14px] object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-[14px] bg-[#181818] text-2xl font-semibold text-white">
              {getPlatformInitials(platform)}
            </div>
          )}

          <a
            href={content.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#181818] underline-offset-2 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Abrir conteúdo
          </a>
        </div>

        <div className="rounded-[18px] border border-black/10 bg-white p-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${getContentStatusClassName(
              content.status,
            )}`}
          >
            {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            {getContentStatusLabel(content.status)}
          </span>

          <h2 className="font-heading mt-3 text-xl font-semibold leading-tight text-[#181818]">
            {content.title ?? content.url}
          </h2>

          {content.description ? (
            <p className="mt-3 text-sm leading-6 text-[#555]">
              {content.description}
            </p>
          ) : null}

          {content.analysis.summary ? (
            <div className="mt-4 rounded-[12px] border border-black/10 bg-[#fbfbfa] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                Resumo estratégico
              </p>
              <p className="mt-2 text-sm leading-6 text-[#333]">
                {content.analysis.summary}
              </p>
            </div>
          ) : null}

          {content.lastError ? (
            <p className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {content.lastError}
            </p>
          ) : null}
        </div>
      </section>

      {hasAnalysis ? (
        <section className="rounded-[18px] border border-black/10 bg-white p-5">
          <h2 className="font-heading text-base font-semibold text-[#141414]">
            Análise da IA
          </h2>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows
              .filter((row) => Boolean(row.value))
              .map((row) => (
                <div
                  key={row.label}
                  className="border-b border-black/5 pb-2 last:border-0 last:pb-0"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#222]">
                    {row.value}
                  </dd>
                </div>
              ))}
          </dl>

          {(content.analysis.patterns?.length ?? 0) > 0 ? (
            <div className="mt-5 border-t border-black/5 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                Padrões observados
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(content.analysis.patterns ?? []).map((pattern, index) => (
                  <span
                    key={`${pattern}-${index}`}
                    className="rounded-full border border-black/10 bg-[#f4f4f2] px-2.5 py-1 text-[11px] font-medium text-[#444]"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {(content.analysis.differentiators?.length ?? 0) > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                Diferenciadores
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(content.analysis.differentiators ?? []).map((entry, index) => (
                  <span
                    key={`${entry}-${index}`}
                    className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {(content.analysis.trendSignals?.length ?? 0) > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                Sinais de tendência
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(content.analysis.trendSignals ?? []).map((entry, index) => (
                  <span
                    key={`${entry}-${index}`}
                    className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="rounded-[18px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-10 text-center">
          <p className="text-sm text-[#888]">
            {isAnalyzing
              ? 'Aguardando análise da IA. Esta página atualiza automaticamente.'
              : 'Nenhuma análise disponível para este conteúdo.'}
          </p>
        </section>
      )}
    </main>
  )
}
