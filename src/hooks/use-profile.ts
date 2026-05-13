import { useQuery } from '@tanstack/react-query'

import type { PublicProfile } from '../shared/types/account-types'
import { profileService } from '../services/profile-service'

export function useProfile(slug: string) {
  return useQuery<PublicProfile, Error>({
    queryKey: ['profile', slug],
    queryFn: () => profileService.getProfileBySlug(slug),
    enabled: Boolean(slug),
  })
}
