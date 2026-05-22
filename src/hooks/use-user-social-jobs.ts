import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { userSocialJobsService } from '../services/user-social-jobs-service'
import { ApiRequestError } from '../shared/lib/api-client'
import type { UserSocialJobsAccess } from '../shared/types/account-types'

export function useUserSocialJobs(userId?: string) {
  const queryClient = useQueryClient()

  const accessQuery = useQuery({
    queryKey: ['user-social-jobs', 'access', userId],
    queryFn: async () => userSocialJobsService.getUserSocialJobsAccess(),
    enabled: !!userId,
    staleTime: 30_000,
  })

  const runMutation = useMutation({
    mutationFn: async () => userSocialJobsService.runUserSocialJobs(),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ['user-social-jobs', 'access', userId] },
        (old: UserSocialJobsAccess | undefined) => {
          if (old) {
            return { ...old, cooldownEndsAt: data.cooldownEndsAt }
          }

          return old
        },
      )

      void queryClient.invalidateQueries({ queryKey: ['user-social-jobs', 'status', userId] })
    },
  })

  const statusQuery = useQuery({
    queryKey: ['user-social-jobs', 'status', userId],
    queryFn: async () => userSocialJobsService.getUserSocialJobsStatus(),
    enabled: !!userId,
    retry: (failureCount, error) => {
      if (error instanceof ApiRequestError && error.statusCode === 404) return false
      return failureCount < 3
    },
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 15_000),
    refetchInterval: (query) => {
      const status = query.state.data

      if (!status || status.isComplete) {
        return false
      }

      return query.state.status === 'error' ? 10_000 : 3_000
    },
  })

  useEffect(() => {
    if (!userId || !statusQuery.data?.isComplete) return

    void queryClient.invalidateQueries({ queryKey: ['content-topics'] })
    void queryClient.invalidateQueries({ queryKey: ['social-accounts', userId] })
    void queryClient.invalidateQueries({ queryKey: ['user-social-jobs', 'access', userId] })
  }, [statusQuery.data?.isComplete, userId, queryClient])

  return {
    accessQuery,
    runMutation,
    statusQuery,
    hasActiveRun: Boolean(statusQuery.data && !statusQuery.data.isComplete),
  }
}
