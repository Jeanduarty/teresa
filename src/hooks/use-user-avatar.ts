import type { AuthUser } from '../shared/types/account-types'

export function clearUserAvatarCache(_userId?: string): void {}

export function useUserAvatar(user?: Pick<AuthUser, 'id' | 'profileUrl'> | null) {
  return {
    avatarUrl: user?.profileUrl ?? null,
    error: null as Error | null,
    isPending: false,
  }
}
