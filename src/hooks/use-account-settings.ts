import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import type { AccountSectionId } from '../app/(private)/settings/account-settings-types'
import { queryClient } from '../shared/lib/query-client'
import type {
  AuthUser,
  MutationMessage,
  PublicProfile,
  UserSessionPage,
} from '../shared/types/account-types'
import { useProfile } from './use-profile'
import { settingsService } from '../services/settings-service'

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
  })

  return {
    profileQuery,
    sessionsQuery,
    updateProfileMutation,
    requestEmailChangeMutation,
    changePasswordMutation,
    requestAccountDeletionMutation,
  }
}
