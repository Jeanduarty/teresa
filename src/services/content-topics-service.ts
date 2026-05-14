import { apiRequest } from '../shared/lib/api-client'
import type {
  ContentTopic,
  ContentTopicFilters,
  ContentTopicGroup,
  ContentTopicMetrics,
  UpdateContentTopicInput,
} from '../shared/types/account-types'

function buildTopicsQueryString(filters?: ContentTopicFilters): string {
  const params = new URLSearchParams()
  const title = filters?.title?.trim()
  const tags = filters?.tags?.map((tag) => tag.trim()).filter(Boolean) ?? []

  if (title) {
    params.set('title', title)
  }

  if (filters?.status) {
    params.set('status', filters.status)
  }

  if (tags.length > 0) {
    params.set('tags', tags.join(','))
  }

  if (filters?.groupId !== undefined) {
    params.set('groupId', filters.groupId ?? 'none')
  }

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export const contentTopicsService = {
  async listTopics(filters?: ContentTopicFilters): Promise<ContentTopic[]> {
    const { topics } = await apiRequest<{ topics: ContentTopic[] }>(
      `/topics${buildTopicsQueryString(filters)}`,
    )
    return topics
  },

  async getTopic({ topicId }: { userId: string; topicId: string }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}`)
    return topic
  },

  async getMetrics(): Promise<ContentTopicMetrics> {
    const { metrics } = await apiRequest<{ metrics: ContentTopicMetrics }>('/topics/metrics')
    return metrics
  },

  async markTopicDone({ topicId }: { userId: string; topicId: string }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}/done`, {
      method: 'PATCH',
    })
    return topic
  },

  async markTopicPending({ topicId }: { userId: string; topicId: string }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}/pending`, {
      method: 'PATCH',
    })
    return topic
  },

  async updateScript({
    topicId,
    script,
  }: {
    userId: string
    topicId: string
    script: string
  }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}/script`, {
      method: 'PATCH',
      body: { script },
    })
    return topic
  },

  async updateTopic({
    topicId,
    title,
    summary,
    tags,
  }: UpdateContentTopicInput): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}`, {
      method: 'PATCH',
      body: {
        ...(title !== undefined ? { title } : {}),
        ...(summary !== undefined ? { summary } : {}),
        ...(tags !== undefined ? { tags } : {}),
      },
    })
    return topic
  },

  async addGroup({
    topicId,
    groupId,
  }: {
    userId: string
    topicId: string
    groupId: string
  }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}/groups/${groupId}`, {
      method: 'POST',
    })
    return topic
  },

  async removeGroup({
    topicId,
    groupId,
  }: {
    userId: string
    topicId: string
    groupId: string
  }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}/groups/${groupId}`, {
      method: 'DELETE',
    })
    return topic
  },

  async deleteTopic({ topicId }: { userId: string; topicId: string }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(`/topics/${topicId}`, {
      method: 'DELETE',
    })
    return topic
  },

  async resetScript({ topicId }: { userId: string; topicId: string }): Promise<ContentTopic> {
    const { topic } = await apiRequest<{ topic: ContentTopic }>(
      `/topics/${topicId}/script/reset`,
      {
        method: 'POST',
      },
    )
    return topic
  },

  async listGroups(): Promise<ContentTopicGroup[]> {
    const { groups } = await apiRequest<{ groups: ContentTopicGroup[] }>('/topics/groups')
    return groups
  },

  async createGroup({ name }: { userId: string; name: string }): Promise<ContentTopicGroup> {
    const { group } = await apiRequest<{ group: ContentTopicGroup }>('/topics/groups', {
      method: 'POST',
      body: { name },
    })
    return group
  },

  async updateGroup({
    groupId,
    name,
  }: {
    userId: string
    groupId: string
    name: string
  }): Promise<ContentTopicGroup> {
    const { group } = await apiRequest<{ group: ContentTopicGroup }>(`/topics/groups/${groupId}`, {
      method: 'PATCH',
      body: { name },
    })
    return group
  },

  async deleteGroup({ groupId }: { userId: string; groupId: string }): Promise<{ groupId: string }> {
    return apiRequest<{ groupId: string }>(`/topics/groups/${groupId}`, {
      method: 'DELETE',
    })
  },
}
