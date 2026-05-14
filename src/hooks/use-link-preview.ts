import { useQuery } from '@tanstack/react-query'

import { contentTopicsService } from '../services/content-topics-service'
import type { LinkPreview } from '../shared/types/account-types'

export function useLinkPreview(url: string) {
  return useQuery<LinkPreview, Error>({
    queryKey: ['link-preview', url],
    queryFn: () => contentTopicsService.getLinkPreview(url),
    enabled: Boolean(url),
    staleTime: 30 * 60 * 1000,
  })
}
