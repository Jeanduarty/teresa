import { Lightbulb, TrendingUp } from 'lucide-react'

import type {
  ExploreAnalysisInsights,
  ExploreInsightOpportunity,
} from '../../../../shared/types/account-types'

const LEVEL_LABEL: Record<NonNullable<ExploreInsightOpportunity['level']>, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
}

const LEVEL_CLASS: Record<NonNullable<ExploreInsightOpportunity['level']>, string> = {
  high: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  low: 'bg-[#f4f4f2] text-[#666] ring-1 ring-black/10',
}

export function AnalysisOpportunitiesAndTrends({
  insights,
}: {
  insights: ExploreAnalysisInsights
}) {
  const opportunities = insights.underexploredOpportunities ?? []
  const trends = insights.emergingTrends ?? []
  const isEmpty = opportunities.length === 0 && trends.length === 0

  if (isEmpty) {
    return (
      <section className="rounded-[18px] border border-dashed border-black/10 bg-[#fbfbfa] px-4 py-10 text-center">
        <Lightbulb className="mx-auto h-6 w-6 text-[#888]" />
        <h2 className="mt-3 font-heading text-base font-semibold text-[#141414]">
          Nenhuma oportunidade ou tendência identificada
        </h2>
        <p className="mx-auto mt-2 max-w-[460px] text-sm leading-6 text-[#666]">
          Após a análise dos conteúdos, oportunidades pouco exploradas e sinais
          de tendência aparecem aqui.
        </p>
      </section>
    )
  }

  return (
    <div className="space-y-8">
      {opportunities.length > 0 ? (
        <section className="space-y-4">
          <header className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#666]" />
            <h2 className="font-heading text-base font-semibold text-[#141414]">
              Oportunidades pouco exploradas ({opportunities.length})
            </h2>
          </header>

          <ul className="grid gap-3">
            {opportunities.map((opportunity, index) => {
              const level = opportunity.level ?? 'medium'

              return (
                <li
                  key={`${opportunity.title}-${index}`}
                  className="rounded-[16px] border border-black/10 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-sm font-semibold text-[#181818]">
                      {opportunity.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${LEVEL_CLASS[level]}`}
                    >
                      {LEVEL_LABEL[level]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#555]">
                    {opportunity.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {trends.length > 0 ? (
        <section className="space-y-4">
          <header className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#666]" />
            <h2 className="font-heading text-base font-semibold text-[#141414]">
              Tendências emergentes ({trends.length})
            </h2>
          </header>

          <ul className="grid gap-3">
            {trends.map((trend, index) => (
              <li
                key={`${trend.title}-${index}`}
                className="rounded-[16px] border border-black/10 bg-white p-4"
              >
                <h3 className="font-heading text-sm font-semibold text-[#181818]">
                  {trend.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">
                  {trend.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
