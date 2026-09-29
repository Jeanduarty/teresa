import { Folder, Plus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../../../components/ui'
import type { ExploreAnalysisSummary } from '../../../../shared/types/account-types'
import {
  formatDate,
  getAnalysisStatusClassName,
  getAnalysisStatusLabel,
  getProgressPercent,
} from './explore-utils'

export function ExploreListPanel({
  analyses,
  isLoading,
  errorMessage,
}: {
  analyses: ExploreAnalysisSummary[]
  isLoading: boolean
  errorMessage?: string
}) {
  const navigate = useNavigate()
  const hasAnalyses = analyses.length > 0

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[#141414]">
            Minhas análises
          </h2>
          <p className="mt-1 max-w-[640px] text-sm leading-6 text-[#666]">
            Adicione links de conteúdos do seu nicho ou concorrentes e a Teresa
            identifica padrões dominantes, hooks recorrentes, posicionamentos e
            oportunidades pouco exploradas.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/explore/new')}
        >
          Nova análise
        </Button>
      </header>

      {isLoading ? (
        <div className="grid gap-4">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-[88px] animate-pulse rounded-[18px] bg-[#f0f0ee]"
            />
          ))}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !hasAnalyses && !errorMessage ? (
        <div className="rounded-[22px] border border-dashed border-black/15 bg-[#fbfbfa] px-6 py-12 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-[#777]" />
          <h3 className="mt-4 font-heading text-xl font-semibold text-[#181818]">
            Nenhuma análise ainda
          </h3>
          <p className="mx-auto mt-2 max-w-[480px] text-sm leading-6 text-[#666]">
            Crie a primeira análise adicionando links de creators,
            concorrentes ou referências do seu nicho.
          </p>
          <Button
            className="mt-5 rounded-full"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/explore/new')}
          >
            Criar primeira análise
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3">
        {analyses.map((analysis) => {
          const progress = getProgressPercent(
            analysis.analyzedCount,
            analysis.linksCount,
          )

          return (
            <article
              key={analysis.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/explore/${analysis.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(`/explore/${analysis.id}`)
                }
              }}
              className="group cursor-pointer rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-[#181818]/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white">
                  <Folder className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading text-lg font-semibold text-[#181818]">
                    {analysis.name}
                  </h3>
                  <p className="mt-1 truncate text-xs font-medium text-[#777]">
                    {analysis.linksCount} link
                    {analysis.linksCount === 1 ? '' : 's'} ·{' '}
                    {analysis.analyzedAt
                      ? `Analisado em ${formatDate(analysis.analyzedAt)}`
                      : `Criado em ${formatDate(analysis.createdAt)}`}
                  </p>
                </div>

                <div className="hidden min-w-[120px] flex-col items-end gap-1 sm:flex">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#f0f0ee]">
                    <div
                      className="h-full rounded-full bg-[#181818] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#666]">
                    {analysis.analyzedCount}/{analysis.linksCount}
                  </span>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${getAnalysisStatusClassName(
                    analysis.status,
                  )}`}
                >
                  {getAnalysisStatusLabel(analysis.status)}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
