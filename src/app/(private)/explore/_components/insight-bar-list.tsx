import type { ExploreInsightShareEntry } from '../../../../shared/types/account-types'

export function InsightBarList({
  title,
  items,
  emptyLabel = 'Sem dados suficientes',
}: {
  title: string
  items: ExploreInsightShareEntry[]
  emptyLabel?: string
}) {
  return (
    <section className="rounded-[18px] border border-black/10 bg-white p-5">
      <h3 className="font-heading text-sm font-semibold text-[#141414]">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="mt-4 rounded-[12px] border border-dashed border-black/10 bg-[#fbfbfa] px-3 py-4 text-xs text-[#888]">
          {emptyLabel}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((entry, index) => (
            <li key={`${entry.label}-${index}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-[#181818]">
                  {entry.label}
                </span>
                <span className="text-xs font-semibold text-[#666]">
                  {Math.round(entry.share)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0f0ee]">
                <div
                  className="h-full rounded-full bg-[#181818] transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, entry.share))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
