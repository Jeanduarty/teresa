import { Search } from 'lucide-react'

import type { ContentTopicGroup } from '../../../shared/types/account-types'
import type {
  TopicCardActionState,
  TopicListActions,
  TopicListActionState,
  TopicListState,
} from './home-types'
import { TopicCard } from './topic-card'

function getTopicCardActionState({
  topicId,
  actionState,
}: {
  topicId: string
  actionState: TopicListActionState
}): TopicCardActionState {
  return {
    addingToGroup: actionState.addingToGroup,
    isAddingToGroup: actionState.isAddingToGroup && actionState.addingToGroup?.topicId === topicId,
    isMarkingDone: actionState.isMarkingDone && actionState.markingDoneTopicId === topicId,
    isMarkingPending: actionState.isMarkingPending && actionState.markingPendingTopicId === topicId,
    isRemovingFromGroup:
      actionState.isRemovingFromGroup &&
      actionState.removingFromGroup?.topicId === topicId,
    removingFromGroup: actionState.removingFromGroup,
  }
}

export function TopicList({
  list,
  actionState,
  actions,
  groups,
}: {
  list: TopicListState
  actionState: TopicListActionState
  actions: TopicListActions
  groups: ContentTopicGroup[]
}) {
  if (list.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-[230px] animate-pulse rounded-[22px] bg-[#f0f0ee]" />
        ))}
      </div>
    )
  }

  if (list.errorMessage) {
    return (
      <div className="rounded-[18px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
        {list.errorMessage}
      </div>
    )
  }

  if (list.topics.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-black/15 bg-[#fbfbfa] px-6 py-12 text-center">
        <Search className="mx-auto h-8 w-8 text-[#777]" />
        <h3 className="mt-4 font-heading text-xl font-semibold text-[#181818]">
          Nenhum topico encontrado
        </h3>
        <p className="mx-auto mt-2 max-w-[460px] text-sm leading-6 text-[#666]">
          Ajuste os filtros ou vincule suas redes sociais para gerar novos topicos.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {list.topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            groups={groups}
            actionState={getTopicCardActionState({
              actionState,
              topicId: topic.id,
            })}
            actions={actions}
          />
        ))}
      </div>

      {list.hasMore ? (
        <p className="mt-6 text-center text-sm font-medium text-[#666]">
          Role para carregar mais topicos.
        </p>
      ) : null}
    </>
  )
}
