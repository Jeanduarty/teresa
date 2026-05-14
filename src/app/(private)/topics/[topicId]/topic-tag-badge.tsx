import { X } from 'lucide-react'

type TopicTagBadgeProps = {
  tag: string
  onRemove?: () => void
}

export function TopicTagBadge({ tag, onRemove }: TopicTagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f4f4f2] px-3 py-1.5 text-xs font-semibold text-[#666]">
      <span className="truncate">{tag}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full text-[#999] transition-colors hover:text-[#181818]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  )
}
