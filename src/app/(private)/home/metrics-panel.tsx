import { BarChart3 } from 'lucide-react'

import { PopoverContent } from '../../../components/ui'
import type { ContentTopicMetrics } from '../../../shared/types/account-types'

export function MetricsPanel({ metrics }: { metrics?: ContentTopicMetrics }) {
  const items = [
    { label: 'Tópicos gerados', value: metrics?.total ?? 0 },
    { label: 'Feitos', value: metrics?.completed ?? 0 },
    { label: 'Pendentes', value: metrics?.pending ?? 0 },
    { label: 'Posts do Twitter/X', value: metrics?.twitterSignals ?? 0 },
    { label: 'Posts do TikTok', value: metrics?.tiktokSignals ?? 0 },
    { label: 'Taxa de conclusao', value: `${metrics?.completionRate ?? 0}%` },
  ]

  return (
    <PopoverContent align="end" className="w-[min(340px,calc(100vw-48px))]">
      <div className="mb-3 flex items-center gap-2 text-[#181818]">
        <BarChart3 className="h-4 w-4" />
        <h2 className="font-heading text-base font-semibold">Metricas dos tópicos</h2>
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
    </PopoverContent>
  )
}
