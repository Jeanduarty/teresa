import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { settingsService } from '../services/settings-service'
import type { AuthUser } from '../shared/types/account-types'

const avatarObjectUrlCache = new Map<string, string>()

function getAvatarCacheKey(user?: Pick<AuthUser, 'id' | 'profileUrl'> | null): string | null {
  return user?.id && user.profileUrl ? `${user.id}:${user.profileUrl}` : null
}

export function clearUserAvatarCache(userId?: string): void {
  for (const [cacheKey, objectUrl] of avatarObjectUrlCache.entries()) {
    if (!userId || cacheKey.startsWith(`${userId}:`)) {
      URL.revokeObjectURL(objectUrl)
      avatarObjectUrlCache.delete(cacheKey)
    }
  }
}

export function useUserAvatar(user?: Pick<AuthUser, 'id' | 'profileUrl'> | null) {
  const cacheKey = getAvatarCacheKey(user)

  const avatarQuery = useQuery<Blob, Error>({
    queryKey: ['user-avatar', user?.id, user?.profileUrl],
    queryFn: settingsService.getProfileAvatar,
    enabled: Boolean(cacheKey),
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const avatarUrl = useMemo(() => {
    if (!cacheKey) {
      return null
    }

    const cachedUrl = avatarObjectUrlCache.get(cacheKey)

    if (cachedUrl) {
      return cachedUrl
    }

    if (!avatarQuery.data) {
      return null
    }

    const objectUrl = URL.createObjectURL(avatarQuery.data)
    avatarObjectUrlCache.set(cacheKey, objectUrl)
    return objectUrl
  }, [avatarQuery.data, cacheKey])

  return {
    ...avatarQuery,
    avatarUrl,
  }
}
