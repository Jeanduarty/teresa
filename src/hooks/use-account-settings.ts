import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import type { AccountSectionId } from '../app/(private)/settings/account-settings-types'
import { queryClient } from '../shared/lib/query-client'
import { clearAuthToken } from '../shared/lib/auth-token-storage'
import { clearUser } from '../store/slices/auth-session-slice'
import { useAppDispatch } from '../store/hooks'
import type {
  AuthUser,
  DevelopmentAccess,
  DevelopmentSocialJobsResult,
  MutationMessage,
  PublicProfile,
  UserSessionPage,
} from '../shared/types/account-types'
import { useProfile } from './use-profile'
import { settingsService } from '../services/settings-service'
import { clearUserAvatarCache } from './use-user-avatar'

interface UseAccountSettingsParams {
  slug: string
  section: AccountSectionId
  userId?: string
  sessionsPage?: number
  sessionsPerPage?: number
}

function syncProfileCache(profileKey: string, updatedUser: AuthUser): void {
  queryClient.setQueryData<PublicProfile>(['profile', profileKey], (currentProfile) => ({
    ...(currentProfile ?? { ...updatedUser, publicWorkspaces: [] }),
    ...updatedUser,
    publicWorkspaces: currentProfile?.publicWorkspaces ?? [],
  }))
}

export function useAccountSettings({
  slug,
  section,
  userId,
  sessionsPage = 1,
  sessionsPerPage = 10,
}: UseAccountSettingsParams) {
  const dispatch = useAppDispatch()
  const profileQuery = useProfile(slug)
  const normalizedSessionsPage = Math.max(1, sessionsPage)
  const normalizedSessionsPerPage = Math.min(Math.max(1, sessionsPerPage), 20)

  const sessionsQuery = useQuery<UserSessionPage, Error>({
    queryKey: ['settings', 'sessions', userId, normalizedSessionsPage, normalizedSessionsPerPage],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return settingsService.getSessions({
        page: normalizedSessionsPage,
        perPage: normalizedSessionsPerPage,
      })
    },
    enabled: Boolean(userId) && section === 'sessions',
    placeholderData: keepPreviousData,
  })

  const developmentAccessQuery = useQuery<DevelopmentAccess, Error>({
    queryKey: ['settings', 'development', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return settingsService.getDevelopmentAccess()
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  })

  const updateProfileMutation = useMutation<
    AuthUser,
    Error,
    Omit<Parameters<typeof settingsService.updateProfile>[0], 'userId'>
  >({
    mutationFn: (input) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return settingsService.updateProfile({ userId, ...input })
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AuthUser | null>(['session'], updatedUser)
      syncProfileCache(slug, updatedUser)
      syncProfileCache(updatedUser.userName, updatedUser)
    },
  })

  const requestEmailChangeMutation = useMutation<
    MutationMessage,
    Error,
    Omit<Parameters<typeof settingsService.requestEmailChange>[0], 'userId'>
  >({
    mutationFn: (input) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return settingsService.requestEmailChange({ userId, ...input })
    },
  })

  const changePasswordMutation = useMutation<
    MutationMessage,
    Error,
    Omit<Parameters<typeof settingsService.changePassword>[0], 'userId'>
  >({
    mutationFn: (input) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return settingsService.changePassword({ userId, ...input })
    },
  })

  const requestAccountDeletionMutation = useMutation<
    MutationMessage,
    Error,
    Omit<Parameters<typeof settingsService.requestAccountDeletion>[0], 'userId'>
  >({
    mutationFn: (input) => {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório')
      }

      return settingsService.requestAccountDeletion({ userId, ...input })
    },
    onSuccess: () => {
      clearAuthToken()
      dispatch(clearUser())
      queryClient.setQueryData<AuthUser | null>(['session'], null)
    },
  })

  const uploadProfileAvatarMutation = useMutation<AuthUser, Error, File>({
    mutationFn: settingsService.uploadProfileAvatar,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AuthUser | null>(['session'], updatedUser)
      syncProfileCache(slug, updatedUser)
      syncProfileCache(updatedUser.userName, updatedUser)
      clearUserAvatarCache(updatedUser.id)
      void queryClient.invalidateQueries({ queryKey: ['user-avatar', updatedUser.id] })
    },
  })

  const removeProfileAvatarMutation = useMutation<AuthUser, Error, void>({
    mutationFn: settingsService.removeProfileAvatar,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AuthUser | null>(['session'], updatedUser)
      syncProfileCache(slug, updatedUser)
      syncProfileCache(updatedUser.userName, updatedUser)
      clearUserAvatarCache(updatedUser.id)
      void queryClient.invalidateQueries({ queryKey: ['user-avatar', updatedUser.id] })
    },
  })

  const runDevelopmentSocialJobsMutation = useMutation<DevelopmentSocialJobsResult, Error, void>({
    mutationFn: settingsService.runDevelopmentSocialJobs,
    onSuccess: (result) => {
      queryClient.setQueryData<DevelopmentAccess | undefined>(
        ['settings', 'development', userId],
        (currentAccess) =>
          currentAccess
            ? {
                ...currentAccess,
                cooldownEndsAt: result.cooldownEndsAt,
              }
            : currentAccess,
      )
    },
  })

  return {
    profileQuery,
    sessionsQuery,
    developmentAccessQuery,
    updateProfileMutation,
    requestEmailChangeMutation,
    changePasswordMutation,
    requestAccountDeletionMutation,
    uploadProfileAvatarMutation,
    removeProfileAvatarMutation,
    runDevelopmentSocialJobsMutation,
  }
}
