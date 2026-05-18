import type {
  ExploreAnalysisStatus,
  ExploreContentStatus,
} from '../../../../shared/types/account-types'

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatDate(date: string | null | undefined): string {
  if (!date) {
    return '—'
  }

  return DATE_FORMATTER.format(new Date(date))
}

export function getAnalysisStatusLabel(status: ExploreAnalysisStatus): string {
  switch (status) {
    case 'completed':
      return 'Análise concluída'
    case 'analyzing':
      return 'Em andamento'
    case 'failed':
      return 'Falhou'
    default:
      return 'Aguardando'
  }
}

export function getAnalysisStatusClassName(status: ExploreAnalysisStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700 ring-1 ring-green-200'
    case 'analyzing':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'failed':
      return 'bg-red-50 text-red-700 ring-1 ring-red-200'
    default:
      return 'bg-[#f4f4f2] text-[#666] ring-1 ring-black/10'
  }
}

export function getContentStatusLabel(status: ExploreContentStatus): string {
  switch (status) {
    case 'completed':
      return 'Analisado'
    case 'analyzing':
      return 'Analisando'
    case 'fetching':
      return 'Buscando preview'
    case 'failed':
      return 'Falhou'
    default:
      return 'Aguardando'
  }
}

export function getContentStatusClassName(status: ExploreContentStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-700 ring-1 ring-green-200'
    case 'analyzing':
    case 'fetching':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'failed':
      return 'bg-red-50 text-red-700 ring-1 ring-red-200'
    default:
      return 'bg-[#f4f4f2] text-[#666] ring-1 ring-black/10'
  }
}

export function getPlatformInitials(platform: string | null | undefined): string {
  if (!platform) {
    return 'WB'
  }

  return platform
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
    .padEnd(2, platform[0]?.toUpperCase() ?? 'W')
}

export function getProgressPercent(analyzed: number, total: number): number {
  if (total <= 0) {
    return 0
  }

  return Math.min(100, Math.round((analyzed / total) * 100))
}
