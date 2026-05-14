import { Check, Folder } from 'lucide-react'
import type { KeyboardEvent, MouseEvent } from 'react'

import { Button } from '../../../components/ui'
import { RichContentText } from '../../../components/rich-content-text'
import type { ContentTopic, ContentTopicGroup } from '../../../shared/types/account-types'
import { formatDate, getStatusLabel } from './home-utils'
import type { TopicCardActions, TopicCardActionState } from './home-types'
import { ProviderBadge } from './provider-badge'
import { TopicGroupBookmark } from './topic-group-bookmark'

function stopCardNavigation(event: MouseEvent<HTMLElement>) {
  event.stopPropagation()
}

export function TopicCard({
  topic,
  actions,
  actionState,
  groups,
}: {
  topic: ContentTopic
  actions: TopicCardActions
  actionState: TopicCardActionState
  groups: ContentTopicGroup[]
}) {
  const isDeleted = topic.status === 'deleted'
  const isCompleted = topic.status === 'completed' || Boolean(topic.completedAt)
  const remainingTags = Math.max(topic.tags.length - 4, 0)
  const remainingGroups = Math.max(topic.groups.length - 3, 0)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      actions.onOpen(topic.id)
    }
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => actions.onOpen(topic.id)}
      onKeyDown={handleKeyDown}
      className="min-h-80 flex flex-col group relative cursor-pointer rounded-[22px] border border-black/10 bg-white p-5 shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-[#181818]/20"
    >
      <TopicGroupBookmark
        topicId={topic.id}
        groups={groups}
        topicGroups={topic.groups}
        actionState={actionState}
        onAddToGroup={actions.onAddToGroup}
        onRemoveFromGroup={actions.onRemoveFromGroup}
      />

      <div className="mb-3 flex flex-wrap items-center gap-2 pr-8">
        <ProviderBadge provider={topic.sourceProvider} />
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isDeleted
              ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
              : isCompleted
                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
          }`}
        >
          {getStatusLabel(topic)}
        </span>
      </div>

      <h2 className="font-heading line-clamp-2 break-words text-xl font-semibold leading-tight text-[#181818]">
        {topic.title}
      </h2>
      <div className="mt-3">
        <RichContentText
          text={topic.summary}
          compactPreview
          className="line-clamp-3 break-words text-sm leading-6 text-[#666]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topic.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            title={tag}
            className="max-w-[140px] truncate rounded-full border border-black/10 bg-[#f4f4f2] px-2.5 py-1 text-[11px] font-medium text-[#666]"
          >
            {tag}
          </span>
        ))}
        {remainingTags > 0 ? (
          <span className="rounded-full border border-black/10 bg-[#f4f4f2] px-2.5 py-1 text-[11px] font-semibold text-[#666]">
            +{remainingTags}
          </span>
        ) : null}
      </div>

      {topic.groups.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {topic.groups.slice(0, 3).map((group) => (
            <span
              key={group.id}
              title={group.name}
              className="inline-flex max-w-[160px] items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#666]"
            >
              <Folder className="h-3 w-3 shrink-0" />
              <span className="truncate">{group.name}</span>
            </span>
          ))}
          {remainingGroups > 0 ? (
            <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#666]">
              +{remainingGroups}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className='mt-5'/>

      <div className="mt-auto flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate text-xs font-medium text-[#777]">{formatDate(topic.generatedAt)}</p>
        <Button
          size="xs"
          variant={isCompleted ? 'outline' : 'secondary'}
          disabled={isDeleted || actionState.isMarkingDone || actionState.isMarkingPending}
          className="self-start rounded-full sm:self-auto"
          icon={<Check className="h-3.5 w-3.5" />}
          onClick={(event) => {
            stopCardNavigation(event)
            if (isCompleted) {
              actions.onMarkPending(topic.id)
              return
            }

            actions.onMarkDone(topic.id)
          }}
        >
          {isCompleted ? 'Marcar como nao feito' : 'Marcar como feito'}
        </Button>
      </div>
    </article>
  )
}
