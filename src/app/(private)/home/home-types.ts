import type {
  ContentTopic,
  ContentTopicGroup,
  ContentTopicStatusFilter,
} from '../../../shared/types/account-types'

export type HomeTab = 'topics' | 'groups'

export type GroupDialogState =
  | { mode: 'create' }
  | { mode: 'edit'; group: ContentTopicGroup }
  | null

export type TopicFiltersState = {
  title: string
  status: ContentTopicStatusFilter
  tags: string
}

export type TopicFilterActions = {
  onApply: (filters: TopicFiltersState) => void
  onClear: () => void
}

export type TopicCardActionState = {
  isMarkingDone: boolean
  isMarkingPending: boolean
  isAddingToGroup?: boolean
  isRemovingFromGroup?: boolean
  addingToGroup?: {
    topicId: string
    groupId: string
  }
  removingFromGroup?: {
    topicId: string
    groupId: string
  }
}

export type TopicCardActions = {
  onOpen: (topicId: string) => void
  onMarkDone: (topicId: string) => void
  onMarkPending: (topicId: string) => void
  onAddToGroup?: (topicId: string, groupId: string) => void
  onRemoveFromGroup: (topicId: string, groupId: string) => void
}

export type TopicListActionState = {
  isMarkingDone: boolean
  markingDoneTopicId?: string
  isMarkingPending: boolean
  markingPendingTopicId?: string
  isAddingToGroup: boolean
  addingToGroup?: {
    topicId: string
    groupId: string
  }
  isRemovingFromGroup: boolean
  removingFromGroup?: {
    topicId: string
    groupId: string
  }
}

export type TopicListActions = TopicCardActions

export type TopicListState = {
  topics: ContentTopic[]
  isLoading: boolean
  errorMessage?: string
  hasMore: boolean
}
