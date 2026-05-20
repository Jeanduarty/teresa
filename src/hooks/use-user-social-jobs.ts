import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { userSocialJobsService } from '../services/user-social-jobs-service'
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
  } catch {}
}

function clearRunId(userId: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(userId))
  } catch {}
}

export function useUserSocialJobs(userId?: string) {
  const queryClient = useQueryClient()

  const [storedRunId, setStoredRunId] = useState<string | null>(() =>
    userId ? readStoredRunId(userId) : null,
  )

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

  const activeRunId = runMutation.data?.runId ?? storedRunId

  const statusQuery = useQuery({
    queryKey: ['user-social-jobs', 'status', userId, activeRunId],
    queryFn: async () => {
      if (!activeRunId) throw new Error('No runId')
      return userSocialJobsService.getUserSocialJobsStatus(activeRunId)
    },
    enabled: !!activeRunId && !!userId,
    retry: 1,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      return data.isComplete ? false : 3000
    },
  })

  useEffect(() => {
    if (!userId || !storedRunId) return
    const shouldClear = statusQuery.data?.isComplete || statusQuery.isError
    if (shouldClear) {
      clearRunId(userId)
      setStoredRunId(null)
    }
  }, [statusQuery.data?.isComplete, statusQuery.isError, userId, storedRunId])

  return {
    accessQuery,
    runMutation,
    statusQuery,
  }
}
