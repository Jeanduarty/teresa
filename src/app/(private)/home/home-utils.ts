import type {
  ContentTopic,
  ContentTopicStatusFilter,
} from '../../../shared/types/account-types'

export function formatDate(dateString: string | null): string {
  if (!dateString) {
    return 'Ainda nao feito'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

export function parseTagInput(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function getStatusLabel(topic: ContentTopic): string {
  if (topic.status === 'deleted') {
    return 'Apagado'
  }

  return topic.status === 'completed' || topic.completedAt ? 'Feito' : 'Pendente'
}

export function hasActiveFilters(filters: {
  title: string
  status: ContentTopicStatusFilter
  tags: string
}) {
  return Boolean(filters.title.trim() || filters.status !== 'all' || filters.tags.trim())
}
