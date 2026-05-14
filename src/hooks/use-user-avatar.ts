import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { settingsService } from '../services/settings-service'
import type { AuthUser } from '../shared/types/account-types'

export function useUserAvatar(user?: Pick<AuthUser, 'id' | 'profileUrl'> | null) {
  const avatarQuery = useQuery<Blob, Error>({
    queryKey: ['user-avatar', user?.id, user?.profileUrl],
    queryFn: settingsService.getProfileAvatar,
    enabled: Boolean(user?.id && user.profileUrl),
    staleTime: 5 * 60 * 1000,
  })

  const avatarUrl = useMemo(
    () => (avatarQuery.data ? URL.createObjectURL(avatarQuery.data) : null),
    [avatarQuery.data],
  )

  useEffect(() => {
    if (avatarUrl) {
      return () => URL.revokeObjectURL(avatarUrl)
    }
  }, [avatarUrl])

  return {
    ...avatarQuery,
    avatarUrl,
  }
}
