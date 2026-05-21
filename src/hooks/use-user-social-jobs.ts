import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { userSocialJobsService } from '../services/user-social-jobs-service'
import { ApiRequestError } from '../shared/lib/api-client'
import type { UserSocialJobsAccess } from '../shared/types/account-types'

function getStorageKey(userId: string) {
  return `social-job-run-${userId}`
}

function readStoredRunId(userId: string): string | null {
  try {
    return sessionStorage.getItem(getStorageKey(userId))
  } catch {
    return null
  }
}

function saveRunId(userId: string, runId: string): void {
  try {
    sessionStorage.setItem(getStorageKey(userId), runId)
  } catch {
    return
  }
}

function clearRunId(userId: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(userId))
  } catch {
    return
  }
}

export function useUserSocialJobs(userId?: string) {
  const queryClient = useQueryClient()
  const activeRunId = userId ? readStoredRunId(userId) : null

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
      if (userId) {
        saveRunId(userId, data.runId)
      }
    },
  })

  const statusQuery = useQuery({
    queryKey: ['user-social-jobs', 'status', userId, activeRunId],
    queryFn: async () => {
      if (!activeRunId) throw new Error('No runId')
      try {
        return await userSocialJobsService.getUserSocialJobsStatus(activeRunId)
      } catch (error) {
        if (userId && error instanceof ApiRequestError && error.statusCode === 404) {
          clearRunId(userId)
        }

        throw error
      }
    },
    enabled: !!activeRunId && !!userId,
    retry: (failureCount, error) => {
      if (error instanceof ApiRequestError && error.statusCode === 404) return false
      return failureCount < 3
    },
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 15_000),
    refetchInterval: (query) => {
      if (query.state.data?.isComplete) return false
      if (!query.queryKey[3]) return false
      return query.state.status === 'error' ? 10_000 : 3_000
    },
  })

  useEffect(() => {
    if (!userId || !activeRunId) return
    if (statusQuery.data?.isComplete) {
      clearRunId(userId)
      void queryClient.invalidateQueries({ queryKey: ['content-topics'] })
      void queryClient.invalidateQueries({ queryKey: ['social-accounts', userId] })
      void queryClient.invalidateQueries({ queryKey: ['user-social-jobs', 'access', userId] })
    }
  }, [activeRunId, statusQuery.data?.isComplete, userId, queryClient])

  return {
    accessQuery,
    runMutation,
    statusQuery,
    hasActiveRun: !!activeRunId,
  }
}
