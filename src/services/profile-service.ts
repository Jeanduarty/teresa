import { apiRequest } from '../shared/lib/api-client'
import type { PublicProfile } from '../shared/types/account-types'

export const profileService = {
  async getProfileBySlug(slug: string): Promise<PublicProfile> {
    const { profile } = await apiRequest<{ profile: PublicProfile }>(`/profile/${slug}`)
    return profile
  },
}
