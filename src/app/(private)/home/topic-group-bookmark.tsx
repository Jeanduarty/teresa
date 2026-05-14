import { Bookmark } from 'lucide-react'
import type { MouseEvent } from 'react'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui'
import type { ContentTopicGroup, ContentTopicGroupSummary } from '../../../shared/types/account-types'
import type { TopicCardActionState } from './home-types'

function stopCardNavigation(event: MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

type TopicGroupBookmarkProps = {
  topicId: string
  groups: ContentTopicGroup[]
  topicGroups: ContentTopicGroupSummary[]
  actionState: TopicCardActionState
  onAddToGroup?: (topicId: string, groupId: string) => void
  onRemoveFromGroup: (topicId: string, groupId: string) => void
}

export function TopicGroupBookmark({
  topicId,
  groups,
  topicGroups,
  actionState,
  onAddToGroup,
  onRemoveFromGroup,
}: TopicGroupBookmarkProps) {
  const isSavedInAnyGroup = topicGroups.length > 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="xs"
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 px-0 shadow-sm ring-1 ring-black/5 hover:bg-[#f4f4f2]"
          aria-label="Salvar topico em grupos"
          icon={
            <Bookmark
              className="h-4 w-4"
              fill={isSavedInAnyGroup ? 'currentColor' : 'none'}
            />
          }
          onClick={stopCardNavigation}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(300px,calc(100vw-32px))] rounded-[18px] p-3"
        onClick={stopCardNavigation}
      >
        <div className="mb-2 px-1">
          <p className="text-sm font-semibold text-[#181818]">Salvar em grupos</p>
          <p className="mt-0.5 text-xs leading-5 text-[#666]">
            Clique em um grupo para alternar o vinculo deste topico.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-black/15 bg-[#fbfbfa] px-3 py-4 text-center text-xs leading-5 text-[#666]">
            Nenhum grupo criado.
          </div>
        ) : (
          <div className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {groups.map((group) => {
              const isInGroup = topicGroups.some((topicGroup) => topicGroup.id === group.id)
              const isAddingThisGroup =
                actionState.isAddingToGroup &&
                actionState.addingToGroup?.topicId === topicId &&
                actionState.addingToGroup?.groupId === group.id
              const isRemovingThisGroup =
                actionState.isRemovingFromGroup &&
                actionState.removingFromGroup?.topicId === topicId &&
                actionState.removingFromGroup?.groupId === group.id
              const isPending = isAddingThisGroup || isRemovingThisGroup

              return (
                <button
                  key={group.id}
                  type="button"
                  disabled={isPending}
                  className="flex w-full items-center justify-between gap-3 rounded-[14px] px-3 py-2 text-left text-sm font-medium text-[#181818] outline-none transition-colors hover:bg-[#f4f4f2] focus-visible:ring-2 focus-visible:ring-[#181818]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => {
                    if (isInGroup) {
                      onRemoveFromGroup?.(topicId, group.id)
                      return
                    }

                    onAddToGroup?.(topicId, group.id)
                  }}
                >
                  <span className="min-w-0 truncate">{group.name}</span>
                  <Bookmark
                    className="h-4 w-4 shrink-0"
                    fill={isInGroup ? 'currentColor' : 'none'}
                  />
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
