import { apiRequest } from '../shared/lib/api-client'
import type {
  CreatorProfile,
  CreatorProfileFieldKey,
  CreatorProfileSnapshot,
} from '../shared/types/account-types'

export const creatorProfileService = {
  async getProfile(): Promise<CreatorProfile> {
    const { profile } = await apiRequest<{ profile: CreatorProfile }>('/creator-profile')
    return profile
  },

  async refresh(): Promise<CreatorProfile> {
    const { profile } = await apiRequest<{ profile: CreatorProfile }>(
      '/creator-profile/refresh',
      { method: 'POST' },
    )
    return profile
  },

  async reset(): Promise<CreatorProfile> {
    const { profile } = await apiRequest<{ profile: CreatorProfile }>(
      '/creator-profile/reset',
      { method: 'POST' },
    )
    return profile
  },

  async adjustField(input: {
    field: CreatorProfileFieldKey
    value: string
  }): Promise<CreatorProfile> {
    const { profile } = await apiRequest<{ profile: CreatorProfile }>('/creator-profile', {
      method: 'PATCH',
      body: input,
    })
    return profile
  },

  async applyDirection(userDirection: string): Promise<CreatorProfile> {
    const { profile } = await apiRequest<{ profile: CreatorProfile }>(
      '/creator-profile/direction',
      { method: 'POST', body: { userDirection } },
    )
    return profile
  },

  async getHistory(): Promise<CreatorProfileSnapshot[]> {
    const { snapshots } = await apiRequest<{ snapshots: CreatorProfileSnapshot[] }>(
      '/creator-profile/history',
    )
    return snapshots
  },

  async restore(snapshotId: string): Promise<CreatorProfile> {
    const { profile } = await apiRequest<{ profile: CreatorProfile }>(
      `/creator-profile/history/${snapshotId}/restore`,
      { method: 'POST' },
    )
    return profile
  },
}
