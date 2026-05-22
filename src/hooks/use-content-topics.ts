import { useMutation, useQuery } from '@tanstack/react-query'

import { contentTopicsService } from '../services/content-topics-service'
import { queryClient } from '../shared/lib/query-client'
import type {
  ContentTopic,
  ContentTopicFilters,
  ContentTopicGroup,
  ContentTopicMetrics,
  ScriptType,
  ScriptView,
  ScriptViewMode,
  UpdateContentTopicInput,
} from '../shared/types/account-types'

function updateTopicInCachedLists(userId: string | undefined, updatedTopic: ContentTopic) {
  queryClient.setQueriesData<ContentTopic[]>(
    { queryKey: ['content-topics', userId, 'list'] },
    (currentTopics = []) =>
      currentTopics.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic)),
  )
}

function getCachedTopic(userId: string | undefined, topicId: string): ContentTopic | undefined {
  const topicFromDetail = queryClient.getQueryData<ContentTopic>(['content-topics', userId, topicId])

  if (topicFromDetail) {
    return topicFromDetail
  }

  const topicLists = queryClient.getQueriesData<ContentTopic[]>({
    queryKey: ['content-topics', userId, 'list'],
  })

  for (const [, topics] of topicLists) {
    const topic = topics?.find((currentTopic) => currentTopic.id === topicId)

    if (topic) {
      return topic
    }
  }

  return undefined
}

function updateMetricsInCache({
  userId,
  previousTopic,
  updatedTopic,
}: {
  userId: string | undefined
  previousTopic?: ContentTopic
  updatedTopic: ContentTopic
}) {
  queryClient.setQueryData<ContentTopicMetrics>(
    ['content-topics', 'metrics', userId],
    (currentMetrics) => {
      if (!currentMetrics) {
        return currentMetrics
      }

      const previousStatus = previousTopic?.status ?? null
      const nextStatus = updatedTopic.status

      if (previousStatus === nextStatus) {
        return currentMetrics
      }

      const completedDelta =
        (nextStatus === 'completed' ? 1 : 0) - (previousStatus === 'completed' ? 1 : 0)
      const pendingDelta =
        (nextStatus === 'pending' ? 1 : 0) - (previousStatus === 'pending' ? 1 : 0)
      const total = Math.max(0, currentMetrics.total)
      const completed = Math.max(0, currentMetrics.completed + completedDelta)
      const pending = Math.max(0, currentMetrics.pending + pendingDelta)

      return {
        ...currentMetrics,
        total,
        completed,
        pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    },
  )
}

export function useContentTopics(userId?: string, filters?: ContentTopicFilters) {
  const topicsQuery = useQuery<ContentTopic[], Error>({
    queryKey: ['content-topics', userId, 'list', filters],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return contentTopicsService.listTopics(filters)
    },
    enabled: Boolean(userId),
  })

  const metricsQuery = useQuery<ContentTopicMetrics, Error>({
    queryKey: ['content-topics', 'metrics', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return contentTopicsService.getMetrics()
    },
    enabled: Boolean(userId),
  })

  const markDoneMutation = useMutation<ContentTopic, Error, string>({
    mutationFn: (topicId) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.markTopicDone({ userId, topicId })
    },
    onSuccess: (updatedTopic, topicId) => {
      const previousTopic = getCachedTopic(userId, topicId)
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, updatedTopic.id], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      updateMetricsInCache({ userId, previousTopic, updatedTopic })
    },
  })

  const markPendingMutation = useMutation<ContentTopic, Error, string>({
    mutationFn: (topicId) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.markTopicPending({ userId, topicId })
    },
    onSuccess: (updatedTopic, topicId) => {
      const previousTopic = getCachedTopic(userId, topicId)
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, updatedTopic.id], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      updateMetricsInCache({ userId, previousTopic, updatedTopic })
    },
  })

  const addGroupMutation = useMutation<
    ContentTopic,
    Error,
    { topicId: string; groupId: string }
  >({
    mutationFn: ({ topicId, groupId }) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.addGroup({ userId, topicId, groupId })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, updatedTopic.id], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  const removeGroupMutation = useMutation<
    ContentTopic,
    Error,
    { topicId: string; groupId: string }
  >({
    mutationFn: ({ topicId, groupId }) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.removeGroup({ userId, topicId, groupId })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, updatedTopic.id], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  const deleteTopicMutation = useMutation<ContentTopic, Error, string>({
    mutationFn: (topicId) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.deleteTopic({ userId, topicId })
    },
    onSuccess: (deletedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, deletedTopic.id], deletedTopic)
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topics', 'metrics', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  return {
    topicsQuery,
    metricsQuery,
    markDoneMutation,
    markPendingMutation,
    addGroupMutation,
    removeGroupMutation,
    deleteTopicMutation,
  }
}

export function useContentTopicDetail({ userId, topicId }: { userId?: string; topicId?: string }) {
  const topicQuery = useQuery<ContentTopic, Error>({
    queryKey: ['content-topics', userId, topicId],
    queryFn: () => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.getTopic({ userId, topicId })
    },
    enabled: Boolean(userId && topicId),
  })

  const updateTopicMutation = useMutation<ContentTopic, Error, Omit<UpdateContentTopicInput, 'userId' | 'topicId'>>({
    mutationFn: (input) => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.updateTopic({ userId, topicId, ...input })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
    },
  })

  const updateScriptMutation = useMutation<ContentTopic, Error, string>({
    mutationFn: (script) => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.updateScript({ userId, topicId, script })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
    },
  })

  const resetScriptMutation = useMutation<ContentTopic, Error, void>({
    mutationFn: () => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.resetScript({ userId, topicId })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
    },
  })

  const markDoneMutation = useMutation<ContentTopic, Error, void>({
    mutationFn: () => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.markTopicDone({ userId, topicId })
    },
    onSuccess: (updatedTopic) => {
      const previousTopic = getCachedTopic(userId, topicId ?? updatedTopic.id)
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      updateMetricsInCache({ userId, previousTopic, updatedTopic })
    },
  })

  const markPendingMutation = useMutation<ContentTopic, Error, void>({
    mutationFn: () => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.markTopicPending({ userId, topicId })
    },
    onSuccess: (updatedTopic) => {
      const previousTopic = getCachedTopic(userId, topicId ?? updatedTopic.id)
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      updateMetricsInCache({ userId, previousTopic, updatedTopic })
    },
  })

  const addGroupMutation = useMutation<ContentTopic, Error, string>({
    mutationFn: (groupId) => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.addGroup({ userId, topicId, groupId })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  const removeGroupMutation = useMutation<ContentTopic, Error, string>({
    mutationFn: (groupId) => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.removeGroup({ userId, topicId, groupId })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  const deleteTopicMutation = useMutation<ContentTopic, Error, void>({
    mutationFn: () => {
      if (!userId || !topicId) {
        throw new Error('ID do usuário e ID do topico são obrigatórios')
      }

      return contentTopicsService.deleteTopic({ userId, topicId })
    },
    onSuccess: (deletedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], deletedTopic)
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topics', 'metrics', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  const updateFieldScriptMutation = useMutation<
    ContentTopic,
    Error,
    { scriptType: ScriptType; view: ScriptView; script: string }
  >({
    mutationFn: ({ scriptType, view, script }) => {
      if (!userId || !topicId) throw new Error('ID do usuário e ID do topico são obrigatórios')
      return contentTopicsService.updateFieldScript({ userId, topicId, scriptType, view, script })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
    },
  })

  const refineScriptMutation = useMutation<
    ContentTopic,
    Error,
    { scriptType: ScriptType; userPrompt: string }
  >({
    mutationFn: ({ scriptType, userPrompt }) => {
      if (!userId || !topicId) throw new Error('ID do usuário e ID do topico são obrigatórios')
      return contentTopicsService.refineScript({ userId, topicId, scriptType, userPrompt })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
    },
  })

  const updateViewModeMutation = useMutation<
    ContentTopic,
    Error,
    { scriptType: ScriptType; viewMode: ScriptViewMode }
  >({
    mutationFn: ({ scriptType, viewMode }) => {
      if (!userId || !topicId) throw new Error('ID do usuário e ID do topico são obrigatórios')
      return contentTopicsService.updateViewMode({ userId, topicId, scriptType, viewMode })
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<ContentTopic>(['content-topics', userId, topicId], updatedTopic)
      updateTopicInCachedLists(userId, updatedTopic)
    },
  })

  return {
    topicQuery,
    updateTopicMutation,
    updateScriptMutation,
    updateFieldScriptMutation,
    refineScriptMutation,
    updateViewModeMutation,
    resetScriptMutation,
    markDoneMutation,
    markPendingMutation,
    addGroupMutation,
    removeGroupMutation,
    deleteTopicMutation,
  }
}

export function useTopicGroups(userId?: string) {
  const groupsQuery = useQuery<ContentTopicGroup[], Error>({
    queryKey: ['content-topic-groups', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      void userId
      return contentTopicsService.listGroups()
    },
    enabled: Boolean(userId),
  })

  const createGroupMutation = useMutation<ContentTopicGroup, Error, string>({
    mutationFn: (name) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.createGroup({ userId, name })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
    },
  })

  const updateGroupMutation = useMutation<ContentTopicGroup, Error, { groupId: string; name: string }>({
    mutationFn: ({ groupId, name }) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.updateGroup({ userId, groupId, name })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId] })
    },
  })

  const deleteGroupMutation = useMutation<{ groupId: string }, Error, string>({
    mutationFn: (groupId) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return contentTopicsService.deleteGroup({ userId, groupId })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['content-topic-groups', userId] })
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId] })
    },
  })

  return {
    groupsQuery,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
  }
}
