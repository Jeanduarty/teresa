import { ChevronRight, Folder, Pencil } from 'lucide-react'

import { Button } from '../../../components/ui'
import type { ContentTopicGroup } from '../../../shared/types/account-types'

export function GroupRow({
  group,
  onOpen,
  onEdit,
}: {
  group: ContentTopicGroup
  onOpen: () => void
  onEdit: () => void
}) {
  return (
    <li>
      <div className="flex items-center gap-3 rounded-[14px] border border-black/8 bg-white px-4 py-3 transition-colors hover:border-black/12 hover:bg-[#fafafa]">
        <button
          type="button"
          className="flex flex-1 items-center gap-3 text-left"
          onClick={onOpen}
          aria-label={`Abrir grupo ${group.name}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f4f4f2]">
            <Folder className="h-4 w-4 text-[#666]" aria-hidden="true" />
          </span>
          <span className="font-heading text-sm font-semibold text-[#141414]">{group.name}</span>
          {group.topicsCount > 0 && (
            <span className="rounded-full bg-[#f4f4f2] px-2 py-0.5 text-[11px] text-[#666]">
              {group.topicsCount}
            </span>
          )}
        </button>

        <Button
          variant="ghost"
          size="xs"
          aria-label={`Editar grupo ${group.name}`}
          icon={<Pencil className="h-3.5 w-3.5" />}
          onClick={onEdit}
        >
          Editar
        </Button>

        <button
          type="button"
          aria-label={`Ver tópicos do grupo ${group.name}`}
          onClick={onOpen}
          className="text-[#ccc] transition-colors hover:text-[#666]"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
