import { Sparkles } from 'lucide-react'

import type {
  ExploreAnalysis,
  ExploreInsightPattern,
} from '../../../../shared/types/account-types'
import { InsightBarList } from './insight-bar-list'

function groupPatterns(patterns: ExploreInsightPattern[]) {
  const groups = new Map<string, ExploreInsightPattern[]>()

  for (const pattern of patterns) {
    const groupName = pattern.group ?? 'Outros'
    const list = groups.get(groupName) ?? []
    list.push(pattern)
    groups.set(groupName, list)
  }

  return Array.from(groups.entries()).map(([group, items]) => ({
    group,
    items: items.sort((a, b) => b.count - a.count),
  }))
}

export function AnalysisOverview({ analysis }: { analysis: ExploreAnalysis }) {
  const insights = analysis.insights
  const overview = analysis.summary ?? insights.overview ?? null
  const hooks = insights.recurringHooks ?? []
  const positionings = insights.commonPositionings ?? []
  const patterns = insights.identifiedPatterns ?? []
  const groupedPatterns = groupPatterns(patterns)
  const maxPatternCount = patterns.reduce(
    (acc, pattern) => Math.max(acc, pattern.count),
    0,
  )

  const isAnalyzing = analysis.status === 'analyzing' || analysis.status === 'pending'

  return (
    <div className="space-y-6">
      <section className="rounded-[18px] border border-black/10 bg-white p-6">
        <header className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#666]" />
          <h2 className="font-heading text-base font-semibold text-[#141414]">
            Resumo da análise
          </h2>
        </header>

        {overview ? (
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#444]">
            {overview}
          </p>
        ) : (
          <p className="mt-4 rounded-[12px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-6 text-sm text-[#888]">
            {isAnalyzing
              ? 'A IA está analisando os conteúdos. O resumo aparecerá assim que a análise terminar.'
              : 'Nenhum resumo disponível.'}
          </p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightBarList
          title="Formatos dominantes"
          items={insights.dominantFormats ?? []}
        />
        <InsightBarList
          title="Tom predominante"
          items={insights.dominantTone ?? []}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[18px] border border-black/10 bg-white p-5">
          <h3 className="font-heading text-sm font-semibold text-[#141414]">
            Principais hooks
          </h3>
          {hooks.length === 0 ? (
            <p className="mt-4 rounded-[12px] border border-dashed border-black/10 bg-[#fbfbfa] px-3 py-4 text-xs text-[#888]">
              Sem dados suficientes
            </p>
          ) : (
            <ol className="mt-4 space-y-2 text-sm text-[#222]">
              {hooks.slice(0, 6).map((hook, index) => (
                <li
                  key={`${hook.label}-${index}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate">
                    {index + 1}. {hook.label}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[#666]">
                    {Math.round(hook.share)}%
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-[18px] border border-black/10 bg-white p-5">
          <h3 className="font-heading text-sm font-semibold text-[#141414]">
            Posicionamentos comuns
          </h3>
          {positionings.length === 0 ? (
            <p className="mt-4 rounded-[12px] border border-dashed border-black/10 bg-[#fbfbfa] px-3 py-4 text-xs text-[#888]">
              Sem dados suficientes
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {positionings.map((entry, index) => (
                <span
                  key={`${entry}-${index}`}
                  className="rounded-full border border-black/10 bg-[#f4f4f2] px-3 py-1.5 text-xs font-medium text-[#444]"
                >
                  {entry}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {patterns.length > 0 ? (
        <section className="rounded-[18px] border border-black/10 bg-white p-5">
          <header className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-sm font-semibold text-[#141414]">
              Padrões identificados ({patterns.length})
            </h3>
          </header>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {groupedPatterns.map((group) => (
              <div key={group.group} className="rounded-[14px] border border-black/10 bg-[#fbfbfa] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                  {group.group}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {group.items.map((pattern, index) => {
                    const width =
                      maxPatternCount > 0
                        ? Math.round((pattern.count / maxPatternCount) * 100)
                        : 0

                    return (
                      <li key={`${pattern.label}-${index}`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-medium text-[#181818]">
                            {pattern.label}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-[#666]">
                            {pattern.count}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#f0f0ee]">
                          <div
                            className="h-full rounded-full bg-[#181818] transition-all"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(insights.audienceSignals ?? []).length > 0 ||
      (insights.brandingSignals ?? []).length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {(insights.audienceSignals ?? []).length > 0 ? (
            <section className="rounded-[18px] border border-black/10 bg-white p-5">
              <h3 className="font-heading text-sm font-semibold text-[#141414]">
                Sinais sobre o público
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[#444]">
                {(insights.audienceSignals ?? []).map((signal, index) => (
                  <li key={`${signal}-${index}`} className="leading-6">
                    · {signal}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(insights.brandingSignals ?? []).length > 0 ? (
            <section className="rounded-[18px] border border-black/10 bg-white p-5">
              <h3 className="font-heading text-sm font-semibold text-[#141414]">
                Sinais de branding
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[#444]">
                {(insights.brandingSignals ?? []).map((signal, index) => (
                  <li key={`${signal}-${index}`} className="leading-6">
                    · {signal}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
