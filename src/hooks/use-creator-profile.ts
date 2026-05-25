import { useMutation, useQuery } from '@tanstack/react-query'

import { creatorProfileService } from '../services/creator-profile-service'
import { queryClient } from '../shared/lib/query-client'
import type {
  CreatorProfile,
  CreatorProfileFieldKey,
  CreatorProfileSnapshot,
} from '../shared/types/account-types'

function profileQueryKey(userId?: string) {
  return ['creator-profile', userId] as const
}

function historyQueryKey(userId?: string) {
  return ['creator-profile', userId, 'history'] as const
}

export function useCreatorProfile(userId?: string) {
  const profileQuery = useQuery<CreatorProfile, Error>({
    queryKey: profileQueryKey(userId),
    queryFn: () => {
      if (!userId) throw new Error('ID do usuário é obrigatório')
      return creatorProfileService.getProfile()
    },
    enabled: Boolean(userId),
  })

  const historyQuery = useQuery<CreatorProfileSnapshot[], Error>({
    queryKey: historyQueryKey(userId),
    queryFn: () => {
      if (!userId) throw new Error('ID do usuário é obrigatório')
      return creatorProfileService.getHistory()
    },
    enabled: Boolean(userId),
  })

  function setProfileCache(profile: CreatorProfile) {
    queryClient.setQueryData<CreatorProfile>(profileQueryKey(userId), profile)
    void queryClient.invalidateQueries({ queryKey: historyQueryKey(userId) })
  }

  const refreshMutation = useMutation<CreatorProfile, Error, void>({
    mutationFn: () => creatorProfileService.refresh(),
    onSuccess: setProfileCache,
  })

  const resetMutation = useMutation<CreatorProfile, Error, void>({
    mutationFn: () => creatorProfileService.reset(),
    onSuccess: setProfileCache,
  })

  const adjustFieldMutation = useMutation<
    CreatorProfile,
    Error,
    { field: CreatorProfileFieldKey; value: string }
  >({
    mutationFn: (input) => creatorProfileService.adjustField(input),
    onSuccess: setProfileCache,
  })

  const applyDirectionMutation = useMutation<CreatorProfile, Error, string>({
    mutationFn: (direction) => creatorProfileService.applyDirection(direction),
    onSuccess: setProfileCache,
  })

  const restoreMutation = useMutation<CreatorProfile, Error, string>({
    mutationFn: (snapshotId) => creatorProfileService.restore(snapshotId),
    onSuccess: setProfileCache,
  })

  return {
    profileQuery,
    historyQuery,
    refreshMutation,
    resetMutation,
    adjustFieldMutation,
    applyDirectionMutation,
    restoreMutation,
  }
}
